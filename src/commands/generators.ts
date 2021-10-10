import { Field, getFields, insertNewLinesParams } from "../utils/documentEdition";
import { capitalize } from "../utils/string";
import { AstNode, getAst } from "../lsp/ast";
import { LSPContext } from "../lsp/setup";
import { window as Window } from "vscode";

function getConstructorContent(className: string, fields: Field[]): string {
    const paramsInside = fields.map((field) => `${field.type} ${field.name}`).join(", ");
    let paramsOutside = "";
    if (fields.length !== 0) {
        paramsOutside = " : ";
        paramsOutside += fields.map((field) => `${field.name}(${field.name})`).join(", ");
    }
    return `${className}(${paramsInside})${paramsOutside} {}`;
}

function getDestructorContent(className: string): string {
    return `~${className}() {}`;
}

function getConstructorDestructorContent(className: string, fields: Field[]): string[] {
    return [getConstructorContent(className, fields), getDestructorContent(className)];
}

function getGetters(fields: Field[]) {
    return fields.map((field) => {
        const { name, type } = field;
        return `${type} get${capitalize(name)}() const { return ${name}; }`;
    });
}

function getSetters(fields: Field[]) {
    return fields.map((field) => {
        const { name, type } = field;
        return `void set${capitalize(name)}(${type} ${name}) { this->${name} = ${name}; }`;
    });
}

function getGettersSetters(fields: Field[]) {
    const getters = getGetters(fields);
    const setters = getSetters(fields);
    return getters.concat(setters);
}

async function showQuickPickFields(ast: AstNode) {
    const fields = getFields(ast);
    const choices = await Window.showQuickPick(
        fields.map((f) => f.name),
        { canPickMany: true, title: "Fields to include" }
    );
    return fields.filter((field) => choices?.includes(field.name));
}

async function generate(context: LSPContext, getContent: (ast: AstNode) => Promise<string[]>) {
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

export async function generateConstructor(context: LSPContext) {
    generate(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return [getConstructorContent(ast.detail!, fields)];
    });
}

export async function generateDestructor(context: LSPContext) {
    generate(context, async (ast) => {
        return [getDestructorContent(ast.detail!)];
    });
}

export async function generateConstructorDestructor(context: LSPContext) {
    generate(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getConstructorDestructorContent(ast.detail!, fields);
    });
}

export async function generateGetters(context: LSPContext) {
    generate(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getGetters(fields);
    });
}

export async function generateSetters(context: LSPContext) {
    generate(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getSetters(fields);
    });
}

export async function generateGettersSetters(context: LSPContext) {
    generate(context, async (ast) => {
        const fields = await showQuickPickFields(ast);
        return getGettersSetters(fields);
    });
}
