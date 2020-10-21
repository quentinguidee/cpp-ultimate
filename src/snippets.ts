import * as vscode from 'vscode';

const headerSnippet = vscode.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const filename = document.fileName.replace(/^.*[\\\/]/, '').replace('.', '_').toUpperCase();
        let item = new vscode.CompletionItem('header', vscode.CompletionItemKind.Snippet);
        item.insertText =
            `#ifndef ${filename}\n` +
            `#define ${filename}\n` +
            `\n` +
            `#endif /* ${filename} */\n`;
        return [item];
    }
});

export { headerSnippet };
