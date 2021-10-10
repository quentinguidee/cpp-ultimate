import { TextDocument, window as Window } from "vscode";

/**
 * Open the text document. If already opened, focus the document.
 * @param document Document to open
 */
export function openTextDocument(document: TextDocument) {
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
