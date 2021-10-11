import { Position, Range, TextDocument, TextLine, Uri, window as Window } from "vscode";
import { AstNode } from "../lsp/ast";
import { getTypeOf, Type } from "./type";

export type AccessModifier = "private" | "public";
export type Field = {
    accessModifier: AccessModifier;
    type: Type;
    name: string;
};

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

export function getFields(ast: AstNode) {
    let currentAccessModifier: AccessModifier = "private";
    let fields: Field[] = [];

    ast.children?.forEach((node) => {
        if (node.kind === "Field") {
            fields.push({
                accessModifier: currentAccessModifier,
                type: getTypeOf(node),
                name: node.detail!,
            });
            return;
        }

        if (node.kind === "AccessSpec") {
            currentAccessModifier = node.arcana?.split(" ").splice(-1)[0]! as AccessModifier;
            return;
        }
    });

    return fields;
}

export function insertNewLinesParams(
    ast: AstNode,
    document: TextDocument,
    content: string[],
    accessModifier: AccessModifier
): [Position, string, Uri] {
    const startLine = ast.range?.start.line!;
    const endLine = ast.range?.end.line!;

    const classDeclarationTextLine = document.lineAt(startLine);
    const tabs = getTabs(classDeclarationTextLine);

    let insertLine = getLineAccessModifier(ast, accessModifier) + 1;
    let text = "";
    if (insertLine === 0) {
        insertLine = getLineOpeningBracket(document, new Range(startLine, 0, endLine, 0)) + 1;
        text = `${tabs}${accessModifier}:\n`;
    }

    content.forEach((line: string) => {
        if (line === "") return (text += "\n");
        text += `${tabs}\t${line}\n`;
    });

    const uri = document.uri;
    const position = new Position(insertLine!, 0);

    return [position, text, uri];
}
