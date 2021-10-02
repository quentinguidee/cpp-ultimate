import { languages } from "vscode";
import { TextDocument, Position, CompletionItem, CompletionItemKind, SnippetString } from "vscode";

const headerSnippet = languages.registerCompletionItemProvider(["c", "cpp"], {
    provideCompletionItems(document: TextDocument, position: Position) {
        const filename = document.fileName
            .replace(/^.*[\\\/]/, "")
            .replace(".", "_")
            .toUpperCase();

        let item = new CompletionItem("header", CompletionItemKind.Snippet);

        item.insertText = `#ifndef ${filename}\n` + `#define ${filename}\n` + `\n` + `#endif /* ${filename} */\n`;

        return [item];
    },
});

export { headerSnippet };
