import * as vscode from "vscode";
import { TextDocument, Position } from "vscode";

const headerSnippet = vscode.languages.registerCompletionItemProvider(
    ["c", "cpp"],
    {
        provideCompletionItems(document: TextDocument, position: Position) {
            const filename = document.fileName
                .replace(/^.*[\\\/]/, "")
                .replace(".", "_")
                .toUpperCase();
            let item = new vscode.CompletionItem(
                "header",
                vscode.CompletionItemKind.Snippet
            );
            item.insertText =
                `#ifndef ${filename}\n` +
                `#define ${filename}\n` +
                `\n` +
                `#endif /* ${filename} */\n`;
            return [item];
        },
    }
);

export { headerSnippet };
