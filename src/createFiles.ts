import { writeFile } from 'fs';
import * as vscode from 'vscode';

async function createClass(context: any) {
    await vscode.window.showInputBox({
        prompt: "Class name",
        placeHolder: "Class"
    }).then((filename) => {
        if (!filename) { return; }
        createFile(context, filename, getHeaderExtension(), "");
        createFile(context, filename, getSourceExtension(), "");
    });
}

async function createHeader(context: any) {
    await vscode.window.showInputBox({
        prompt: "Header filename",
        placeHolder: "Filename"
    }).then((filename) => {
        if (!filename) { return; }
        createFile(context, filename, getHeaderExtension(), "");
    });
}

async function createSource(context: any) {
    await vscode.window.showInputBox({
        prompt: "Source filename",
        placeHolder: "Filename"
    }).then((filename) => {
        if (!filename) { return; }
        createFile(context, filename, getSourceExtension(), "");
    });
}

function getHeaderExtension(): string {
    return vscode.workspace.getConfiguration().get("cpp-ultimate.files.header-extension") || "hpp";
}

function getSourceExtension(): string {
    return vscode.workspace.getConfiguration().get("cpp-ultimate.files.source-extension") || "cpp";
}

async function createFile(context: any, filename: string, extension: string, content: string) {
    const file = vscode.Uri.file(context.path + '/' + filename + '.' + extension);
    await writeFile(file.fsPath, content, () => { });
}

export { createClass, createHeader, createSource };
