import { createClass, createHeader, createSource, createCMakeLists, createClangFormat } from "./createFiles";
import { headerSnippet } from "./snippets";
import { commands, ExtensionContext, window as Window } from "vscode";
import { LSPContext } from "./lsp/setup";
import { switchHeaderSource } from "./lsp/switchHeaderSource";

export function activate(context: ExtensionContext) {
    const outputChannel = Window.createOutputChannel("cpp-ultimate");

    console.log("[C++ Ultimate] is now active!");

    const lspContext = new LSPContext();

    const _switchHeaderSource = () => switchHeaderSource(lspContext.client);

    context.subscriptions.push(
        // LSP
        lspContext,

        // Commands
        commands.registerCommand("cpp-ultimate.createClass", createClass),
        commands.registerCommand("cpp-ultimate.createHeader", createHeader),
        commands.registerCommand("cpp-ultimate.createSource", createSource),
        commands.registerCommand("cpp-ultimate.createCMakeLists", createCMakeLists),
        commands.registerCommand("cpp-ultimate.createClangFormat", createClangFormat),
        commands.registerCommand("cpp-ultimate.switch-header-source", _switchHeaderSource),

        // Snippets
        headerSnippet
    );

    lspContext.activate(context.globalStoragePath, outputChannel);
}

export function deactivate() {}
