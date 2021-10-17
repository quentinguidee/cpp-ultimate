import { window as Window, workspace as Workspace, Uri, TextDocument } from "vscode";
import { RequestType, TextDocumentIdentifier, LanguageClient } from "vscode-languageclient/node";
import { openTextDocument } from "../utils/documents";

const switchHeaderSourceRequest = new RequestType<TextDocumentIdentifier, string | undefined, void>(
    "textDocument/switchSourceHeader"
);

export async function getSwitchSourceHeaderUri(client: LanguageClient): Promise<Uri> {
    if (!Window.activeTextEditor) return Promise.reject();

    const activePath = Window.activeTextEditor.document.fileName;
    const activeUri = Uri.file(activePath);
    const activeDocumentIdentifier = TextDocumentIdentifier.create(activeUri.toString());
    const destinationPath = await client.sendRequest(switchHeaderSourceRequest, activeDocumentIdentifier);

    if (!destinationPath) {
        Window.showInformationMessage("Matching header/source file not found.");
        return Promise.reject();
    }

    return Uri.parse(destinationPath);
}

export async function switchHeaderSource(client: LanguageClient): Promise<void> {
    const destinationUri = await getSwitchSourceHeaderUri(client);
    const document = await Workspace.openTextDocument(destinationUri);

    openTextDocument(document);
}
