import { CodeAction, Position, TextDocument, TextLine, Uri, WorkspaceEdit } from "vscode";
import { AstNode } from "../lsp/ast";

export function getTabs(line: TextLine): string {
    const firstCharacterIndex = line.firstNonWhitespaceCharacterIndex;
    return line.text.substring(0, firstCharacterIndex);
}

export function insertNewLineParams(ast: AstNode, document: TextDocument, content: string): [Uri, Position, string] {
    return insertNewLinesParams(ast, document, [content]);
}

export function insertNewLinesParams(ast: AstNode, document: TextDocument, content: string[]): [Uri, Position, string] {
    let lineIndex = ast.range?.start.line! + 1;
    let line = document.lineAt(lineIndex);

    const tabs = getTabs(document.lineAt(lineIndex - 1)) + "\t";

    const lineFirstCharacterIndex = line.firstNonWhitespaceCharacterIndex;
    const firstCharacter = line.text[lineFirstCharacterIndex];
    if (firstCharacter === "{") {
        lineIndex += 1;
    }

    const uri = document.uri;

    let text = "";
    content.forEach((line) => {
        text += `${tabs}${line}\n`;
    });

    const position = new Position(lineIndex, 0);

    return [uri, position, text];
}
