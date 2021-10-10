import { ExtensionContext, window as Window } from "vscode";
import { LSPContext } from "./lsp/setup";

import * as snippets from "./snippets";
import * as codeActions from "./codeActions";
import * as commands from "./commands/commands";

export function activate(context: ExtensionContext) {
    const outputChannel = Window.createOutputChannel("cpp-ultimate");

    console.log("[C++ Ultimate] is now active!");

    const lspContext = new LSPContext();
    context.subscriptions.push(lspContext);

    snippets.activate(context);
    codeActions.activate(context, lspContext);
    commands.activate(context, lspContext);
    lspContext.activate(context.globalStoragePath, outputChannel);
}

export function deactivate() {}
