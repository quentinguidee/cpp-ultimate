import { window as Window, TextDocument } from "vscode";
import { RequestType, TextDocumentIdentifier, Range } from "vscode-languageclient/node";
import { LSPContext } from "./setup";

interface AstParams {
    textDocument: TextDocumentIdentifier;
    range: Range;
}

export interface AstNode {
    role: string;
    kind: string;
    detail?: string;
    arcana?: string;
    children?: AstNode[];
    range?: Range;
}

const astRequestType = new RequestType<AstParams, AstNode | null, void>("textDocument/ast");

export async function getAst(context: LSPContext, document: TextDocument, range: Range): Promise<AstNode | null> {
    if (!Window.activeTextEditor) {
        return null;
    }

    const documentIdentifier = TextDocumentIdentifier.create(document.uri.toString());

    const response = await context.client.sendRequest(astRequestType, {
        textDocument: documentIdentifier,
        range: range,
    });

    return response;
}
