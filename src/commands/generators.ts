import { Field, getFields, insertNewLinesParams } from "../utils/documentEdition";
import { capitalize } from "../utils/string";
import { AstNode, getAst } from "../lsp/ast";
import { LSPContext } from "../lsp/setup";
import { QuickPickOptions, window as Window } from "vscode";
import { asConstRef, asConstRefIfNecessary, mustBeConstRef } from "../utils/type";

type Content = string[];

function getConstructorContent(className: string, fields: Field[]): Content {
    const paramsInside = fields.map((field) => `${asConstRefIfNecessary(field.type)} ${field.name}`).join(", ");
    let paramsOutside = "";
    if (fields.length !== 0) {
        paramsOutside = " : ";
        paramsOutside += fields.map((field) => `${field.name}(${field.name})`).join(", ");
    }
    return [`${className}(${paramsInside})${paramsOutside} {}`];
}

function getDestructorContent(className: string): Content {
    return [`~${className}() {}`];
}

function getConstructorDestructorContent(className: string, fields: Field[]): Content {
    return [...getConstructorContent(className, fields), ...getDestructorContent(className)];
}

function getGetters(fields: Field[]): Content {
    return fields.map((field: Field) => {
        const { name, type } = field;
        return `${asConstRefIfNecessary(type)} get${capitalize(name)}() const { return ${name}; }`;
    });
}

function getSetters(fields: Field[]): Content {
    return fields.map((field: Field) => {
        const { name, type } = field;
        return `void set${capitalize(name)}(${asConstRefIfNecessary(type)} ${name}) { this->${name} = ${name}; }`;
    });
}

function getGettersSetters(fields: Field[]): Content {
    const getters = getGetters(fields);
    const setters = getSetters(fields);
    if (getters.length !== setters.length) return [];
    const content = [];
    for (let i = 0; i < getters.length; i++) content.push(getters[i], setters[i], "");
    content.pop();
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

async function generateCode(context: LSPContext, getContent: (ast: AstNode) => Promise<Content>) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const content = await getContent(ast);
    if (!content) return;

    const [position, text] = insertNewLinesParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}

async function generateCodeWithFields(
    context: LSPContext,
    getContent: (ast: AstNode, fields: Field[]) => Promise<Content>
) {
    generateCode(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getContent(ast, fields);
    });
}

export async function generateConstructor(context: LSPContext) {
    generateCodeWithFields(context, async (ast, fields) => getConstructorContent(ast.detail!, fields));
}

export async function generateDestructor(context: LSPContext) {
    generateCode(context, async (ast) => getDestructorContent(ast.detail!));
}

export async function generateConstructorDestructor(context: LSPContext) {
    generateCodeWithFields(context, async (ast, fields) => getConstructorDestructorContent(ast.detail!, fields));
}

export async function generateGetters(context: LSPContext) {
    generateCodeWithFields(context, async (_, fields) => getGetters(fields));
}

export async function generateSetters(context: LSPContext) {
    generateCodeWithFields(context, async (_, fields) => getSetters(fields));
}

export async function generateGettersSetters(context: LSPContext) {
    generateCodeWithFields(context, async (_, fields) => getGettersSetters(fields));
}
