import { createClass, createHeader, createSource, createCMakeLists, createClangFormat } from "./createFiles";
import { headerSnippet } from "./snippets";
import { CodeActionKind, commands, ExtensionContext, languages, window as Window } from "vscode";
import { LSPContext } from "./lsp/setup";
import { switchHeaderSource } from "./lsp/switchHeaderSource";
import {
    GenerateCodeActionProvider,
    generateConstructor,
    generateConstructorDestructor,
    generateDestructor,
    generateGetters,
    generateGettersSetters,
    generateSetters,
} from "./codeActions";

export function activate(context: ExtensionContext) {
    const outputChannel = Window.createOutputChannel("cpp-ultimate");

    console.log("[C++ Ultimate] is now active!");

    const lspContext = new LSPContext();

    const _switchHeaderSource = () => switchHeaderSource(lspContext.client);

    const _generateConstructor = async () => generateConstructor(lspContext);
    const _generateDestructor = async () => generateDestructor(lspContext);
    const _generateConstructorDestructor = async () => generateConstructorDestructor(lspContext);
    const _generateGetters = async () => generateGetters(lspContext);
    const _generateSetters = async () => generateSetters(lspContext);
    const _generateGettersSetters = async () => generateGettersSetters(lspContext);

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
        commands.registerCommand("cpp-ultimate.generate-constructor", _generateConstructor),
        commands.registerCommand("cpp-ultimate.generate-destructor", _generateDestructor),
        commands.registerCommand("cpp-ultimate.generate-constructor-destructor", _generateConstructorDestructor),
        commands.registerCommand("cpp-ultimate.generate-getters", _generateGetters),
        commands.registerCommand("cpp-ultimate.generate-setters", _generateSetters),
        commands.registerCommand("cpp-ultimate.generate-getters-setters", _generateGettersSetters),

        // Snippets
        headerSnippet,

        // CodeActions
        languages.registerCodeActionsProvider("cpp", new GenerateCodeActionProvider(lspContext), {
            providedCodeActionKinds: [CodeActionKind.Refactor],
        })
    );

    lspContext.activate(context.globalStoragePath, outputChannel);
}

export function deactivate() {}
