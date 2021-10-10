import {
    CancellationToken,
    CodeAction,
    CodeActionContext,
    CodeActionKind,
    CodeActionProvider,
    Command,
    ExtensionContext,
    languages as Languages,
    Range,
    Selection,
    TextDocument,
} from "vscode";
import { getAst } from "./lsp/ast";
import { LSPContext } from "./lsp/setup";

export function activate(context: ExtensionContext, lspContext: LSPContext) {
    context.subscriptions.push(
        Languages.registerCodeActionsProvider("cpp", new GenerateCodeActionProvider(lspContext), {
            providedCodeActionKinds: GenerateCodeActionProvider.providedCodeActionsKinds,
        })
    );
}

export class GenerateCodeActionProvider implements CodeActionProvider {
    static providedCodeActionsKinds = [CodeActionKind.Refactor];

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
