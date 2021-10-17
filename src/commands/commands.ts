import {
    generateConstructor,
    generateDestructor,
    generateConstructorDestructor,
    generateGetters,
    generateSetters,
    generateGettersSetters,
} from "./generators";
import { commands as Commands, ExtensionContext } from "vscode";
import { createClangFormat, createClass, createCMakeLists, createHeader, createSource } from "./createFiles";
import { LSPContext } from "../lsp/setup";
import { switchHeaderSource } from "./switchHeaderSource";

export function activate(context: ExtensionContext, lspContext: LSPContext) {
    const _switchHeaderSource = () => switchHeaderSource(lspContext.client);

    const _generateConstructor = async () => generateConstructor(lspContext.client, lspContext);
    const _generateDestructor = async () => generateDestructor(lspContext.client, lspContext);
    const _generateConstructorDestructor = async () => generateConstructorDestructor(lspContext.client, lspContext);
    const _generateGetters = async () => generateGetters(lspContext.client, lspContext);
    const _generateSetters = async () => generateSetters(lspContext.client, lspContext);
    const _generateGettersSetters = async () => generateGettersSetters(lspContext.client, lspContext);

    context.subscriptions.push(
        Commands.registerCommand("cpp-ultimate.createClass", createClass),
        Commands.registerCommand("cpp-ultimate.createHeader", createHeader),
        Commands.registerCommand("cpp-ultimate.createSource", createSource),
        Commands.registerCommand("cpp-ultimate.createCMakeLists", createCMakeLists),
        Commands.registerCommand("cpp-ultimate.createClangFormat", createClangFormat),

        Commands.registerCommand("cpp-ultimate.switch-header-source", _switchHeaderSource),

        Commands.registerCommand("cpp-ultimate.generate-constructor", _generateConstructor),
        Commands.registerCommand("cpp-ultimate.generate-destructor", _generateDestructor),
        Commands.registerCommand("cpp-ultimate.generate-constructor-destructor", _generateConstructorDestructor),
        Commands.registerCommand("cpp-ultimate.generate-getters", _generateGetters),
        Commands.registerCommand("cpp-ultimate.generate-setters", _generateSetters),
        Commands.registerCommand("cpp-ultimate.generate-getters-setters", _generateGettersSetters)
    );
}
