import {
    CancellationToken,
    CodeAction,
    CodeActionContext,
    CodeActionKind,
    CodeActionProvider,
    Command,
    Position,
    Range,
    Selection,
    TextDocument,
    workspace,
    WorkspaceEdit,
} from "vscode";
import { AstNode, getAst } from "./lsp/ast";

import { LSPContext } from "./lsp/setup";
import { insertNewLineParams, insertNewLinesParams } from "./utils/documentEdition";

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
        console.log(ast);
        if (ast === null) {
            return [];
        }

        if (ast.kind === "CXXRecord") {
            items.push(
                this.generateConstructor(ast, document),
                this.generateDestructor(ast, document),
                this.generateConstructorDestructor(ast, document)
            );
        }

        return items;
    }

    private getConstructorContent(className: string): string {
        return `${className}() {}`;
    }

    private getDestructorContent(className: string): string {
        return `~${className}() {}`;
    }

    private generateConstructor(ast: AstNode, document: TextDocument) {
        const action = new CodeAction("Constructor", CodeActionKind.Refactor);

        const content = this.getConstructorContent(ast.detail!);
        const [uri, position, text] = insertNewLineParams(ast, document, content);

        action.edit = new WorkspaceEdit();
        action.edit.insert(uri, position, text);

        return action;
    }

    private generateDestructor(ast: AstNode, document: TextDocument) {
        const action = new CodeAction("Destructor", CodeActionKind.Refactor);

        const content = this.getDestructorContent(ast.detail!);
        const [uri, position, text] = insertNewLineParams(ast, document, content);

        action.edit = new WorkspaceEdit();
        action.edit.insert(uri, position, text);

        return action;
    }

    private generateConstructorDestructor(ast: AstNode, document: TextDocument) {
        const action = new CodeAction("Constructor + destructor");

        const className = ast.detail!;
        const constructor = this.getConstructorContent(className);
        const destructor = this.getDestructorContent(className);

        const [uri, position, text] = insertNewLinesParams(ast, document, [constructor, destructor]);

        action.edit = new WorkspaceEdit();
        action.edit.insert(uri, position, text);

        return action;
    }
}
