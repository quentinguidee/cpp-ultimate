import { AstNode } from "../lsp/ast";

export type Type = {
    name: string;
    kind: string;
};

export function getTypeOf(node: AstNode): Type {
    const child = node.children![0];

    if (!child.children) {
        return {
            name: child.detail!,
            kind: child.kind,
        };
    }

    const children = child.children;
    if (children) {
        return {
            name: children.map((n) => n.detail).join(""),
            kind: children[0].kind,
        };
    }

    return {
        name: "err",
        kind: "err",
    };
}

export function mustBeConstRef(type: Type) {
    return type.kind !== "Builtin";
}

export function asConstRef(type: Type) {
    return `const ${type.name}&`;
}

export function asConstRefIfNecessary(type: Type) {
    return mustBeConstRef(type) ? asConstRef(type) : type.name;
}
