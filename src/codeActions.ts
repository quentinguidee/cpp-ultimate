import {
    CancellationToken,
    CodeAction,
    CodeActionContext,
    CodeActionKind,
    CodeActionProvider,
    Command,
    Range,
    Selection,
    TextDocument,
    window as Window,
} from "vscode";
import { AstNode, getAst } from "./lsp/ast";

import { LSPContext } from "./lsp/setup";
import { Field, getFields, insertNewLineParams, insertNewLinesParams } from "./utils/documentEdition";
import { capitalize } from "./utils/string";

export class GenerateCodeActionProvider implements CodeActionProvider {
    constructor(private context: LSPContext) {}

    public async provideCodeActions(
        document: TextDocument,
        range: Range | Selection,
        context: CodeActionContext,
        token: CancellationToken
    ): Promise<(CodeAction | Command)[]> {
        let items = [];

        const ast = await getAst(this.context, document, range);
        if (!ast) return [];

        if (ast.kind === "CXXRecord") {
            items.push(
                this.generateConstructor(),
                this.generateDestructor(),
                this.generateConstructorDestructor(),
                this.generateGetters(),
                this.generateSetters(),
                this.generateGettersSetters()
            );
        }

        return items;
    }

    private generateConstructor() {
        const action = new CodeAction("Constructor", CodeActionKind.Refactor);
        action.command = {
            title: "Constructor",
            command: "cpp-ultimate.generate-constructor",
        };
        return action;
    }

    private generateDestructor() {
        const action = new CodeAction("Destructor", CodeActionKind.Refactor);
        action.command = {
            title: "Destructor",
            command: "cpp-ultimate.generate-destructor",
        };
        return action;
    }

    private generateConstructorDestructor() {
        const action = new CodeAction("Constructor + destructor", CodeActionKind.Refactor);
        action.command = {
            title: "Constructor + destructor",
            command: "cpp-ultimate.generate-constructor-destructor",
        };
        return action;
    }

    private generateGetters() {
        const action = new CodeAction("Getters", CodeActionKind.Refactor);
        action.command = {
            title: "Getters",
            command: "cpp-ultimate.generate-getters",
        };
        return action;
    }

    private generateSetters() {
        const action = new CodeAction("Setters", CodeActionKind.Refactor);
        action.command = {
            title: "Setters",
            command: "cpp-ultimate.generate-setters",
        };
        return action;
    }

    private generateGettersSetters() {
        const action = new CodeAction("Getters + setters", CodeActionKind.Refactor);
        action.command = {
            title: "Getters + setters",
            command: "cpp-ultimate.generate-getters-setters",
        };
        return action;
    }
}

function getConstructorContent(className: string, params: Field[]): string {
    const paramsInside = params.map((field) => `${field.type} ${field.name}`).join(", ");
    let paramsOutside = "";
    if (params.length !== 0) {
        paramsOutside = " : ";
        paramsOutside += params.map((field) => `${field.name}(${field.name})`).join(", ");
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

export async function generateConstructor(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const fields = await showQuickPickFields(ast);
    const content = getConstructorContent(ast.detail!, fields);
    const [position, text] = insertNewLineParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}

export async function generateDestructor(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const content = getDestructorContent(ast.detail!);
    const [position, text] = insertNewLineParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}

export async function generateConstructorDestructor(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const fields = await showQuickPickFields(ast);
    const content = getConstructorDestructorContent(ast.detail!, fields);
    const [position, text] = insertNewLinesParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}

export async function generateGetters(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const fields = await showQuickPickFields(ast);
    const content = getGetters(fields);

    const [position, text] = insertNewLinesParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}

export async function generateSetters(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const fields = await showQuickPickFields(ast);
    const content = getSetters(fields);

    const [position, text] = insertNewLinesParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}
export async function generateGettersSetters(context: LSPContext) {
    if (!Window.activeTextEditor) return;

    const editor = Window.activeTextEditor;
    const document = editor.document;

    const ast = await getAst(context);
    if (!ast) return;

    const fields = await showQuickPickFields(ast);
    const content = getGettersSetters(fields);

    const [position, text] = insertNewLinesParams(ast, document, content, "public");

    editor.edit((builder) => builder.insert(position, text));
}
