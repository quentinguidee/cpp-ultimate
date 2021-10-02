import { createClass, createHeader, createSource, createCMakeLists, createClangFormat } from "./createFiles";
import { headerSnippet, keywordsCppSpecificSnippets, keywordsSnippets, sequencesSnippet } from "./snippets";
import { commands, ExtensionContext, window as Window } from "vscode";
import { LSPContext } from "./lsp/setup";

export function activate(context: ExtensionContext) {
    const outputChannel = Window.createOutputChannel("cpp-ultimate");

    console.log("[C++ Ultimate] is now active!");

    const lspContext = new LSPContext();

    context.subscriptions.push(
        // LSP
        lspContext,

        // Commands
        commands.registerCommand("cpp-ultimate.createClass", createClass),
        commands.registerCommand("cpp-ultimate.createHeader", createHeader),
        commands.registerCommand("cpp-ultimate.createSource", createSource),
        commands.registerCommand("cpp-ultimate.createCMakeLists", createCMakeLists),
        commands.registerCommand("cpp-ultimate.createClangFormat", createClangFormat),

        // Snippets
        headerSnippet,
        sequencesSnippet,
        keywordsSnippets,
        keywordsCppSpecificSnippets
    );

    lspContext.activate(context.globalStoragePath, outputChannel);
}

export function deactivate() {}
