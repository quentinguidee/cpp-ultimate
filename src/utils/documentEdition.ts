import { Position, Range, TextDocument, TextLine, Uri } from "vscode";
import { AstNode } from "../lsp/ast";

export type AccessModifier = "private" | "public";

export function getTabs(line: TextLine): string {
    const firstCharacterIndex = line.firstNonWhitespaceCharacterIndex;
    return line.text.substring(0, firstCharacterIndex);
}

export function getLineAccessModifier(ast: AstNode, accessModifier: AccessModifier) {
    const node = ast.children?.find((node) => {
        return node.kind === "AccessSpec" && node.arcana?.split(" ").splice(-1)[0] === accessModifier;
    });
    if (node === undefined) return -1;
    return node?.range?.end.line ?? -1;
}

export function getLineOpeningBracket(document: TextDocument, searchRange: Range) {
    let line = searchRange.start.line;
    while (line <= searchRange.end.line) {
        const index = document.lineAt(line).text.indexOf("{");
        if (index >= 0) return line;
        line++;
    }
    return -1;
}

export function insertNewLineParams(
    ast: AstNode,
    document: TextDocument,
    content: string,
    accessModifier: AccessModifier
): [Uri, Position, string] {
    return insertNewLinesParams(ast, document, [content], accessModifier);
}

export function insertNewLinesParams(
    ast: AstNode,
    document: TextDocument,
    content: string[],
    accessModifier: AccessModifier
): [Uri, Position, string] {
    const startLine = ast.range?.start.line!;
    const endLine = ast.range?.end.line!;

    const classDeclarationTextLine = document.lineAt(startLine);
    const tabs = getTabs(classDeclarationTextLine);

    let insertLine = getLineAccessModifier(ast, accessModifier) + 1;
    let text = "";
    if (insertLine === 0) {
        console.log({ document });
        insertLine = getLineOpeningBracket(document, new Range(startLine, 0, endLine, 0)) + 1;
        text = `${tabs}${accessModifier}:\n`;
    }

    content.forEach((line) => {
        text += `${tabs}\t${line}\n`;
    });

    const uri = document.uri;
    const position = new Position(insertLine!, 0);

    return [uri, position, text];
}
