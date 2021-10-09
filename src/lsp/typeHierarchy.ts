import { window as Window, TextDocument, Selection } from "vscode";

import {
    RequestType,
    TextDocumentIdentifier,
    TextDocumentPositionParams,
    Range,
    SymbolKind,
} from "vscode-languageclient/node";

import { LSPContext } from "./setup";

enum TypeHierarchyDirection {
    children = 0,
    parents = 1,
    both = 2,
}

interface TypeHierarchyParams extends TextDocumentPositionParams {
    resolve?: number;
    direction: TypeHierarchyDirection;
}

interface TypeHierarchyItem {
    name: string;
    detail?: string;
    kind: SymbolKind;
    deprecated?: boolean;
    uri: string;
    range: Range;
    selectionRange: Range;
    parents?: TypeHierarchyItem[];
    children?: TypeHierarchyItem[];
    data?: any;
}

const typeHierarchyRequestType = new RequestType<TypeHierarchyParams, TypeHierarchyItem | null, void>(
    "textDocument/typeHierarchy"
);

export async function getHierarchy(
    context: LSPContext,
    document: TextDocument,
    range: Range | Selection
): Promise<void> {
    if (!Window.activeTextEditor) return;

    const documentIdentifier = TextDocumentIdentifier.create(document.uri.toString());

    const response = await context.client.sendRequest(typeHierarchyRequestType, {
        textDocument: documentIdentifier,
        position: range.start,
        resolve: 10,
        direction: TypeHierarchyDirection.both,
    });
}
