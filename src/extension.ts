import { createClass, createHeader, createSource, createCMakeLists, createClangFormat } from "./createFiles";
import { headerSnippet, keywordsCppSpecificSnippets, keywordsSnippets, sequencesSnippet } from "./snippets";
import { commands, ExtensionContext } from "vscode";

export function activate(context: ExtensionContext) {
    console.log("[C++ Ultimate] is now active!");

    context.subscriptions.push(
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
}

export function deactivate() {}
