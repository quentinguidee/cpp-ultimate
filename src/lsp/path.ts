import * as clangd from "@clangd/install";
import * as path from "path";

import { AbortController } from "abort-controller";
import {
    ConfigurationTarget,
    env,
    ProgressLocation,
    ProgressOptions,
    Uri,
    window as Window,
    workspace as Workspace,
    commands as Commands,
} from "vscode";

export async function getClangdPath(globalStoragePath: string) {
    const ui = new UI(globalStoragePath);
    const status = await clangd.prepare(ui, true);
    return status.clangdPath;
}

class UI {
    constructor(private globalStoragePath: string) {}

    get storagePath(): string {
        return this.globalStoragePath;
    }

    get clangdPath(): string {
        let p: any = Workspace.getConfiguration().get("cpp-ultimate.clangd-path");

        const rootPath = Workspace.rootPath;
        if (!path.isAbsolute(p) && p.includes(path.sep) && rootPath !== undefined) {
            p = path.join(rootPath, p);
        }

        return p;
    }

    set clangdPath(p: string) {
        Workspace.getConfiguration().update("cpp-ultimate.clangd-path", p, ConfigurationTarget.Global);
    }

    info(s: string): void {
        Window.showInformationMessage(s);
    }

    error(s: string): void {
        Window.showErrorMessage(s);
    }

    async showHelp(message: string, url: string) {
        if (await Window.showInformationMessage(message, "Open website")) {
            env.openExternal(Uri.parse(url));
        }
    }

    async promptReload(message: string) {
        if (await Window.showInformationMessage(message, "Reload")) {
            Commands.executeCommand("workbench.action.reloadWindow");
        }
    }

    async promptUpdate(oldVersion: string, newVersion: string) {
        if (await Window.showInformationMessage("Clangd update available!", `Update to ${newVersion}`)) {
            clangd.installLatest(this);
        }
    }

    async promptInstall(version: string) {
        if (await Window.showInformationMessage("Install Clangd ? (required to use C++ Ultimate).", "Install")) {
            clangd.installLatest(this);
        }
    }

    async shouldReuse(path: string): Promise<boolean | undefined> {
        const message = `clangd already installed at ${path}.`;
        const use = "Use";
        const reinstall = "Reinstall";
        const response = await Window.showInformationMessage(message, use, reinstall);

        if (response === use) {
            return true;
        } else if (response === reinstall) {
            return false;
        } else {
            return undefined;
        }
    }

    slow<T>(title: string, work: Promise<T>): Promise<T> {
        const options: ProgressOptions = {
            location: ProgressLocation.Notification,
            title: title,
            cancellable: false,
        };
        return Promise.resolve(Window.withProgress(options, () => work));
    }

    progress<T>(
        title: string,
        cancel: AbortController | null,
        work: (progress: (fraction: number) => void) => Promise<T>
    ): Promise<T> {
        const options: ProgressOptions = {
            location: ProgressLocation.Notification,
            title: title,
            cancellable: cancel !== null,
        };
        return Promise.resolve(
            Window.withProgress(options, async (progress, _cancel) => {
                if (cancel) {
                    _cancel.onCancellationRequested((_) => cancel.abort());
                }

                let previousFraction = 0;
                return work((fraction) => {
                    if (fraction > previousFraction) {
                        progress.report({ increment: 100 * (fraction - previousFraction) });
                        previousFraction = fraction;
                    }
                });
            })
        );
    }
}
