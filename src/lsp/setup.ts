import {
    window as Window,
    workspace as Workspace,
    languages as Languages,
    Disposable,
    OutputChannel,
    TextDocument,
    CompletionList,
    CompletionItem,
    CompletionItemKind,
    SnippetString,
} from "vscode";

import {
    ServerOptions,
    LanguageClient,
    LanguageClientOptions,
    RevealOutputChannelOn,
    MessageSignature,
    ResponseError,
    CancellationToken,
} from "vscode-languageclient/node";

import { getClangdPath } from "./path";

const documentSelector = [
    { scheme: "file", language: "c" },
    { scheme: "file", language: "cpp" },
];

export function isCppDocument(document: TextDocument) {
    return Languages.match(documentSelector, document);
}

class Client extends LanguageClient {
    handleFailedRequest<T>(
        type: MessageSignature,
        error: any,
        token: CancellationToken | undefined,
        defaultValue: T
    ): T {
        if (error instanceof ResponseError && type.method === "workspace/executeCommand") {
            Window.showErrorMessage(error.message);
        }

        return super.handleFailedRequest(type, token, error, defaultValue);
    }
}

export class LSPContext implements Disposable {
    client!: Client;

    async activate(globalStoragePath: string, outputChannel: OutputChannel) {
        const clangdPath = await getClangdPath(globalStoragePath);
        if (!clangdPath) {
            return;
        }

        const serverOptions: ServerOptions = {
            command: clangdPath,
            options: { cwd: Workspace.rootPath || process.cwd() },
        };

        const clientOptions: LanguageClientOptions = {
            documentSelector,
            outputChannel,
            revealOutputChannelOn: RevealOutputChannelOn.Never,
            middleware: {
                provideCompletionItem: async (document, position, context, token, next) => {
                    let list = (await next(document, position, context, token)) as CompletionList<CompletionItem>;
                    let items = list.items.map((item) => {
                        const trailingSpace =
                            item.kind === CompletionItemKind.Keyword || item.kind === CompletionItemKind.Interface;
                        const label = item.label.toString();
                        const insertTextSnippet = item.insertText as SnippetString;
                        const insertText = insertTextSnippet.value;
                        if (label[0] === " ") {
                            item.label = label.substring(1);
                        }
                        if (trailingSpace) {
                            item.insertText = insertText + " ";
                        }
                        return item;
                    });
                    return new CompletionList(items);
                },
            },
        };

        this.client = new Client("C++ Ultimate language server", serverOptions, clientOptions);
        this.client.clientOptions.errorHandler = this.client.createDefaultErrorHandler(1);
        this.client.start();
    }

    dispose() {
        if (this.client !== undefined) {
            this.client.stop();
        }
    }
}
