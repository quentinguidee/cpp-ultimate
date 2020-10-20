import { writeFile } from 'fs';
import { createClass, createHeader, createSource } from './createFiles';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cpp-ultimate" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('cpp-ultimate.createClass', createClass),
		vscode.commands.registerCommand('cpp-ultimate.createHeader', createHeader),
		vscode.commands.registerCommand('cpp-ultimate.createSource', createSource),
	);
}

export function deactivate() { }
