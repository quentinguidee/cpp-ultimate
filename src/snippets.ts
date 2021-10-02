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

const sequencesSnippet = languages.registerCompletionItemProvider(["c", "cpp"], {
    provideCompletionItems(document: TextDocument, position: Position) {
        const keywords = ["while", "if", "for"];

        const items = keywords.map((keyword) => {
            const item = new CompletionItem(keyword, CompletionItemKind.Snippet);

            item.insertText = new SnippetString(`${keyword} ($1) $0`);
            item.preselect = true;

            return item;
        });

        return items;
    },
});

export { headerSnippet, sequencesSnippet };
