import { commands as Commands, window as Window, workspace as Workspace, Uri, ViewColumn, TextDocument } from "vscode";
import { RequestType, TextDocumentIdentifier, LanguageClient } from "vscode-languageclient/node";

const switchHeaderSourceRequest = new RequestType<TextDocumentIdentifier, string | undefined, void>(
    "textDocument/switchSourceHeader"
);

export async function switchHeaderSource(client: LanguageClient): Promise<void> {
    if (!Window.activeTextEditor) {
        return;
    }

    const activePath = Window.activeTextEditor.document.fileName;
    const activeUri = Uri.file(activePath);
    const activeDocumentIdentifier = TextDocumentIdentifier.create(activeUri.toString());
    const destinationPath = await client.sendRequest(switchHeaderSourceRequest, activeDocumentIdentifier);

    if (!destinationPath) {
        Window.showInformationMessage("Matching file not found.");
        return;
    }

    const destinationUri = Uri.parse(destinationPath);
    const document = await Workspace.openTextDocument(destinationUri);

    openTextDocument(document);
}

function openTextDocument(document: TextDocument) {
    const notFound = !Window.visibleTextEditors.some((editor) => {
        if (editor.document === document) {
            Window.showTextDocument(document, editor.viewColumn);
            return true;
        }
        return false;
    });

    if (notFound) {
        Window.showTextDocument(document);
    }
}
