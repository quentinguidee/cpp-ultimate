import { Octokit } from "@octokit/core";
import { existsSync, writeFile } from "fs";
import * as vscode from "vscode";

const octokit = new Octokit();

async function createClass(context: any) {
    await vscode.window
        .showInputBox({
            prompt: "Class name",
            placeHolder: "Class",
        })
        .then((classname) => {
            if (!classname) return;

            var filename = classname.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            if (filename[0] === "_") {
                filename = filename.slice(1, filename.length);
            }

            createFile(context, filename, getHeaderExtension(), getHeaderClassTemplate(filename, classname));
            createFile(context, filename, getSourceExtension(), getSourceClassTemplate(filename));
        });
}

async function createHeader(context: any) {
    await vscode.window
        .showInputBox({
            prompt: "Header filename",
            placeHolder: "Filename",
        })
        .then((filename) => {
            if (!filename) return;
            createFile(context, filename, getHeaderExtension(), getHeaderTemplate(filename));
        });
}

async function createSource(context: any) {
    await vscode.window
        .showInputBox({
            prompt: "Source filename",
            placeHolder: "Filename",
        })
        .then((filename) => {
            if (!filename) return;
            createFile(context, filename, getSourceExtension(), "");
        });
}

function createCMakeLists(context: any) {
    createFile(context, "CMakeLists", "txt", getCMakeListsTemplate());
}

async function createClangFormat(context: any) {
    vscode.window.withProgress(
        {
            title: "Downloading .clang-format template from Gist...",
            location: vscode.ProgressLocation.Notification,
        },
        (progress, token) => {
            return new Promise((resolve, reject) => {
                getClangFormatTemplate().then((template) => {
                    createFile(context, "", "clang-format", template);
                    resolve("Finished");
                });
            });
        }
    );
}

function getHeaderExtension(): string {
    return vscode.workspace.getConfiguration().get("cpp-ultimate.files.header-extension") || "hpp";
}

function getSourceExtension(): string {
    return vscode.workspace.getConfiguration().get("cpp-ultimate.files.source-extension") || "cpp";
}

function getClangFormatGistID(): string {
    return (
        vscode.workspace.getConfiguration().get("cpp-ultimate.clang-format.gist-id") ||
        "28ca0c7533aac5a5185b5f2651c35e8a"
    );
}

function createFile(context: any, filename: string, extension: string, content: string) {
    const path = context.path + "/" + filename + "." + extension;
    if (existsSync(path)) {
        vscode.window.showInformationMessage("The file " + filename + "." + extension + " already exists.");
        return;
    }
    const file = vscode.Uri.file(path);
    writeFile(file.fsPath, content, () => {});
}

function getHeaderClassTemplate(filename: string, classname: string) {
    filename = filename.toUpperCase();
    let extension = getHeaderExtension().toUpperCase();
    return (
        `#ifndef ${filename}_${extension}\n` +
        `#define ${filename}_${extension}\n` +
        `\n` +
        `class ${classname}\n` +
        `{\n` +
        `private:\n` +
        `public:\n` +
        `    ${classname}() {}\n` +
        `    ~${classname}() {}\n` +
        `};\n` +
        `\n` +
        `#endif /* ${filename}_${extension} */\n`
    );
}

function getHeaderTemplate(filename: string) {
    filename = filename.toUpperCase();
    let extension = getHeaderExtension().toUpperCase();
    return (
        `#ifndef ${filename}_${extension}\n` +
        `#define ${filename}_${extension}\n` +
        `\n` +
        `#endif /* ${filename}_${extension} */\n`
    );
}

function getSourceClassTemplate(filename: string) {
    return `#include "${filename}.${getHeaderExtension()}"\n`;
}

function getCMakeListsTemplate() {
    return (
        `set(HEADERS\n` +
        `\n` +
        `)\n` +
        `\n` +
        `set(SOURCES\n` +
        `\n` +
        `)\n` +
        `\n` +
        "target_sources(library PUBLIC ${HEADERS} ${SOURCES})\n"
    );
}

async function getClangFormatTemplate(): Promise<string> {
    const gistID = getClangFormatGistID();
    const error = `Error while fetching ${gistID}`;

    return new Promise((resolve, reject) => {
        octokit
            .request("GET /gists/{gist_id}", {
                gist_id: getClangFormatGistID(), // eslint-disable-line
            })
            .then((response) => {
                console.log(response);
                if (response.data.files) {
                    resolve(response.data.files[".clang-format"]?.content || error);
                } else {
                    reject(error);
                }
            })
            .catch((e) => reject(e));
    });
}

export { createClass, createHeader, createSource, createCMakeLists, createClangFormat };
