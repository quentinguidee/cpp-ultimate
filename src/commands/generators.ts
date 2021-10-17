import { Field, getFields, insertNewLinesInHeaderParams, insertNewLinesInSourceParams } from "../utils/documentEdition";
import { capitalize } from "../utils/string";
import { AstNode, getAst } from "../lsp/ast";
import { LSPContext } from "../lsp/setup";
import { QuickPickOptions, window as Window, workspace as Workspace } from "vscode";
import { asConstRefIfNecessary } from "../utils/type";
import { getSwitchSourceHeaderUri } from "./switchHeaderSource";
import { LanguageClient } from "vscode-languageclient/node";
import { openTextDocument } from "../utils/documents";

type Content = {
    header: string[];
    source: string[];
};

function getConstructorContent(className: string, fields: Field[]): Content {
    const paramsInside = fields.map((field) => `${asConstRefIfNecessary(field.type)} ${field.name}`).join(", ");
    let paramsOutside = "";
    if (fields.length !== 0) {
        paramsOutside = " : ";
        paramsOutside += fields.map((field) => `${field.name}(${field.name})`).join(", ");
    }
    return {
        header: [`${className}(${paramsInside});`],
        source: ["", `${className}::${className}(${paramsInside})${paramsOutside} {}`, ""],
    };
}

function getDestructorContent(className: string): Content {
    return {
        header: [`~${className}();`],
        source: ["", `${className}::~${className}() {}`, ""],
    };
}

function getConstructorDestructorContent(className: string, fields: Field[]): Content {
    const constructor = getConstructorContent(className, fields);
    const destructor = getDestructorContent(className);

    return {
        header: [...constructor.header, ...destructor.header],
        source: [...constructor.source, ...destructor.source],
    };
}

function getGetters(className: string, fields: Field[]): Content {
    let source: string[] = [];
    fields.forEach((field: Field) => {
        const { name, type } = field;
        source.push(
            "",
            `${asConstRefIfNecessary(type)} ${className}::get${capitalize(name)}() const`,
            `{`,
            `\treturn ${name};`,
            `}`,
            ""
        );
    });

    return {
        header: fields.map((field: Field) => {
            const { name, type } = field;
            return `${asConstRefIfNecessary(type)} get${capitalize(name)}() const;`;
        }),
        source,
    };
}

function getSetters(className: string, fields: Field[]): Content {
    let source: string[] = [];
    fields.forEach((field: Field) => {
        const { name, type } = field;
        source.push(
            "",
            `void ${className}::set${capitalize(name)}(${asConstRefIfNecessary(type)} ${name})`,
            `{`,
            `\tthis->${name} = ${name};`,
            `}`,
            ""
        );
    });

    return {
        header: fields.map((field: Field) => {
            const { name, type } = field;
            return `void set${capitalize(name)}(${asConstRefIfNecessary(type)} ${name});`;
        }),
        source,
    };
}

function getGettersSetters(className: string, fields: Field[]): Content {
    const getters = getGetters(className, fields);
    const setters = getSetters(className, fields);

    const content: Content = {
        header: [],
        source: [],
    };

    for (let i = 0; i < getters.header.length; i++) {
        content.header.push("", getters.header[i], setters.header[i]);
        content.source.push(...getters.source.slice(i * 6, i * 6 + 6), ...setters.source.slice(i * 6, i * 6 + 6));
    }

    return content;
}

async function showQuickPickFields(ast: AstNode): Promise<Field[]> {
    const fields = getFields(ast);
    if (fields.length === 0) return Promise.resolve([]);

    const items = fields.map((f) => f.name);
    const options: QuickPickOptions = {
        canPickMany: true,
        title: "Fields to include",
    };
    const choices = await Window.showQuickPick(items, options);
    return fields.filter((field) => choices?.includes(field.name));
}

async function generateCode(
    client: LanguageClient,
    context: LSPContext,
    getContent: (ast: AstNode) => Promise<Content>
) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const documentHeader = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const content = await getContent(ast);
    if (!content) return;

    const [positionHeader, textHeader] = insertNewLinesInHeaderParams(ast, documentHeader, content.header, "public");
    editor.edit((builder) => builder.insert(positionHeader, textHeader));

    const sourceUri = await getSwitchSourceHeaderUri(client);
    const editorSource = await Window.showTextDocument(sourceUri);
    const [positionSource, textSource] = insertNewLinesInSourceParams(ast, editorSource.document, content.source);
    editorSource.edit((builder) => builder.insert(positionSource, textSource));
}

async function generateCodeWithFields(
    client: LanguageClient,
    context: LSPContext,
    getContent: (ast: AstNode, fields: Field[]) => Promise<Content>
) {
    generateCode(client, context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getContent(ast, fields);
    });
}

export async function generateConstructor(client: LanguageClient, context: LSPContext) {
    generateCodeWithFields(client, context, async (ast, fields) => getConstructorContent(ast.detail!, fields));
}

export async function generateDestructor(client: LanguageClient, context: LSPContext) {
    generateCode(client, context, async (ast) => getDestructorContent(ast.detail!));
}

export async function generateConstructorDestructor(client: LanguageClient, context: LSPContext) {
    generateCodeWithFields(client, context, async (ast, fields) =>
        getConstructorDestructorContent(ast.detail!, fields)
    );
}

export async function generateGetters(client: LanguageClient, context: LSPContext) {
    generateCodeWithFields(client, context, async (ast, fields) => getGetters(ast.detail!, fields));
}

export async function generateSetters(client: LanguageClient, context: LSPContext) {
    generateCodeWithFields(client, context, async (ast, fields) => getSetters(ast.detail!, fields));
}

export async function generateGettersSetters(client: LanguageClient, context: LSPContext) {
    generateCodeWithFields(client, context, async (ast, fields) => getGettersSetters(ast.detail!, fields));
}
