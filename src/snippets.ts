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

const keywordsSnippets = languages.registerCompletionItemProvider(["c", "cpp"], {
    provideCompletionItems(document: TextDocument, position: Position) {
        const keywords = [
            // signed/unsigned
            "signed",
            "unsigned",
            // short/long
            "short",
            "long",
            // basic types
            "char",
            "int",
            "float",
            "double",
            // keywords
            "const",
            "return",
            "static",
            "void",
            "extern",
            "auto",
        ];

        let items: CompletionItem[] = keywords.map((keyword) => {
            const item = new CompletionItem(keyword, CompletionItemKind.Keyword);
            item.insertText = `${keyword} `;
            item.preselect = true;
            return item;
        });

        return items;
    },
});

const keywordsCppSpecificSnippets = languages.registerCompletionItemProvider(["cpp"], {
    provideCompletionItems(document: TextDocument, position: Position) {
        const keywords = [
            // basic types
            "bool",
            "int8_t",
            "int16_t",
            "int32_t",
            "int64_t",
            "intptr_t",
            "uint8_t",
            "uint16_t",
            "uint32_t",
            "uint64_t",
            "uintptr_t",
            "char16_t",
            "char32_t",
            // keywords
            "new",
            "typedef",
        ];

        let items: CompletionItem[] = keywords.map((keyword) => {
            const item = new CompletionItem(keyword, CompletionItemKind.Keyword);
            item.insertText = `${keyword} `;
            item.preselect = true;
            return item;
        });

        return items;
    },
});

export { headerSnippet, sequencesSnippet, keywordsSnippets, keywordsCppSpecificSnippets };
