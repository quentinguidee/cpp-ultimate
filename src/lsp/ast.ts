import { window as Window, workspace as Workspace, Uri } from "vscode";
import { LanguageClient, RequestType, TextDocumentIdentifier, Range } from "vscode-languageclient/node";
import { LSPContext } from "./setup";

interface AstParams {
    textDocument: TextDocumentIdentifier;
    range: Range;
}

interface AstNode {
    role: string;
    kind: string;
    detail?: string;
    arcana?: string;
    children?: AstNode[];
    range?: Range;
}

const astRequestType = new RequestType<AstParams, AstNode | null, void>("textDocument/ast");

export async function getAst(context: LSPContext, range: Range): Promise<void> {
    if (!Window.activeTextEditor) {
        return;
    }

    const activePath = Window.activeTextEditor.document.fileName;
    const activeUri = Uri.file(activePath);
    const activeDocumentIdentifier = TextDocumentIdentifier.create(activeUri.toString());

    const response = await context.client.sendRequest(astRequestType, {
        textDocument: activeDocumentIdentifier,
        range: range,
    });
}
