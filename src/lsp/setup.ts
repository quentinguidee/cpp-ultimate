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
    Position,
    CompletionContext,
    CompletionItemLabel,
} from "vscode";

import {
    ServerOptions,
    LanguageClient,
    LanguageClientOptions,
    RevealOutputChannelOn,
    MessageSignature,
    ResponseError,
    CancellationToken,
    ProvideCompletionItemsSignature,
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

    async provideCompletionItem(
        document: TextDocument,
        position: Position,
        context: CompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature
    ) {
        let list = (await next(document, position, context, token)) as CompletionList<CompletionItem>;
        let items = list.items.map((item) => {
            const appendSpace = item.kind === CompletionItemKind.Keyword || item.kind === CompletionItemKind.Interface;

            const hideHints = !Workspace.getConfiguration().get("cpp-ultimate.hints-in-snippets");

            const label = item.label as string;
            const insertText = item.insertText as SnippetString;

            // Label
            if (label[0] === " ") {
                item.label = label.substring(1);
            }

            // Insert text
            if (hideHints) {
                insertText.value = insertText.value.replace(/:.*?(?=})/g, "");
                insertText.value = insertText.value.replace(/\n|\r/g, "");
            }

            if (appendSpace) {
                insertText.value = insertText.value + " ";
            }

            return item;
        });
        return new CompletionList(items);
    }

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
                provideCompletionItem: this.provideCompletionItem,
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
