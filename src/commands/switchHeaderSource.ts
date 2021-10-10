import { window as Window, workspace as Workspace, Uri } from "vscode";
import { RequestType, TextDocumentIdentifier, LanguageClient } from "vscode-languageclient/node";
import { openTextDocument } from "../utils/documents";

const switchHeaderSourceRequest = new RequestType<TextDocumentIdentifier, string | undefined, void>(
    "textDocument/switchSourceHeader"
);

export async function switchHeaderSource(client: LanguageClient): Promise<void> {
    if (!Window.activeTextEditor) return;

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
