/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import * as zowe from "@brightside/core";
import { CliProfileManager, Logger } from "@brightside/imperative";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { USSTree } from "./USSTree";
import { ZoweNode } from "./ZoweNode";

// Globals
export const BRIGHTTEMPFOLDER = path.join(__dirname, "..", "..", "resources", "temp");

/**
 * The function that runs when the extension is loaded
 *
 * @export
 * @param {vscode.ExtensionContext} context - Context of vscode at the time that the function is called
 */
export async function activate(context: vscode.ExtensionContext) {
    // Call deactivate before continuing
    // this is to handle if the application crashed on a previous execution and
    // VSC didn't get a chance to call our deactivate to cleanup.
    await deactivate();
    fs.mkdirSync(BRIGHTTEMPFOLDER);

    let ussFileProvider: USSTree;
    try {
        // Initialize file provider with the created session and the selected pattern
        ussFileProvider = new USSTree();
        await ussFileProvider.addSession();

        // Initialize Imperative Logger
        const loggerConfig = require(path.join(context.extensionPath, "log4jsconfig.json"));
        loggerConfig.log4jsConfig.appenders.default.filename = path.join(context.extensionPath, "logs", "imperative.log");
        loggerConfig.log4jsConfig.appenders.imperative.filename = path.join(context.extensionPath, "logs", "imperative.log");
        loggerConfig.log4jsConfig.appenders.app.filename = path.join(context.extensionPath, "logs", "zowe.log");
        Logger.initLogger(loggerConfig);
    } catch (err) {
        vscode.window.showErrorMessage(err.message);
    }

    // Attaches the TreeView as a subscriber to the refresh event of ussFileProvider
    const disposable = vscode.window.createTreeView("zowe.explorer", {treeDataProvider: ussFileProvider});
    context.subscriptions.push(disposable);

    vscode.commands.registerCommand("zowe.addSession", async () => addSession(ussFileProvider));
    vscode.commands.registerCommand("zowe.refreshAll", () => refreshAll(ussFileProvider));
    vscode.commands.registerCommand("zowe.refreshNode", (node) => refreshPS(node));
    vscode.commands.registerCommand("zowe.pattern", (node) => enterPattern(node, ussFileProvider));
    vscode.commands.registerCommand("zowe.ZoweNode.open", (node) => open(node));
    vscode.commands.registerCommand("zowe.removeSession", async (node) => ussFileProvider.deleteSession(node));
}


/**
 * Adds a new Profile to the USS treeview by clicking the 'Plus' button and
 * selecting which profile you would like to add from the drop-down that appears.
 * The profiles that are in the tree view already will not appear in the
 * drop-down
 *
 * @export
 * @param {USSTree} ussFileProvider - our ussTree object
 */
export async function addSession(ussFileProvider: USSTree) {
    let profileManager;
    try {
        profileManager = await new CliProfileManager({
            profileRootDirectory: path.join(os.homedir(), ".zowe", "profiles"),
            type: "zosmf"
        });
    } catch (err) {
        vscode.window.showErrorMessage(`Unable to load profile manager: ${err.message}`);
        throw (err);
    }

    let profileNamesList = profileManager.getAllProfileNames();
    if (profileNamesList) {
        profileNamesList = profileNamesList.filter((profileName) =>
            // Find all cases where a profile is not already displayed
            !ussFileProvider.mSessionNodes.find((sessionNode) =>
                sessionNode.mLabel === profileName
            )
        );
    } else {
        vscode.window.showInformationMessage("No profiles detected");
        return;
    }
    if (profileNamesList.length) {
        const quickPickOptions: vscode.QuickPickOptions = {
            placeHolder: "Select a Profile to Add to the Data Set Explorer",
            ignoreFocusOut: true,
            canPickMany: false
        };
        const chosenProfile = await vscode.window.showQuickPick(profileNamesList, quickPickOptions);
        await ussFileProvider.addSession(chosenProfile);
    } else {
        vscode.window.showInformationMessage("No more profiles to add");
    }
}

function cleanDir(directory) {
    if (!fs.existsSync(directory)) {
        return;
    }
    fs.readdirSync(directory).forEach((file) => {
        const fullpath = path.join(directory, file)
        const lstat = fs.lstatSync(fullpath);
        if (lstat.isFile()) {
            fs.unlinkSync(fullpath);
        } else {
            cleanDir(fullpath);
        }
    });
    fs.rmdirSync(directory);
}
/**
 * Cleans up the default local storage directory
 *
 * @export
 */
export async function deactivate() {
    if (!fs.existsSync(BRIGHTTEMPFOLDER)) {
        return;
    }
    try {
        cleanDir(BRIGHTTEMPFOLDER)
    } catch (err) {
        vscode.window.showErrorMessage("Unable to delete temporary folder."+err);
    }
}



/**
 * Prompts the user for a path, and populates the [TreeView]{@link vscode.TreeView} based on the path
 *
 * @param {ZoweNode} node - The session node
 * @param {ussTree} ussFileProvider - Current ussTree used to populate the TreeView
 * @returns {Promise<void>}
 */
export async function enterPattern(node: ZoweNode, ussFileProvider: USSTree) {
    let remotepath: string;
    // manually entering a search
    const options: vscode.InputBoxOptions = {
        prompt: "Search Unix System Services (USS) by entering a path name starting with a /",
        value: node.pattern
    };
    // get user input
    remotepath = await vscode.window.showInputBox(options);
    if (!remotepath) {
        vscode.window.showInformationMessage("You must enter a path.");
        return;
    }

    // update the treeview with the new path
    // TODO figure out why a label change is needed to refresh the treeview,
    // instead of changing the collapsible state
    // change label so the treeview updates
    node.label = node.label + " ";
    node.label.trim();
    node.tooltip = node.pattern = remotepath;
    node.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    node.dirty = true;
    ussFileProvider.refresh();
}

/**
 * Returns the profile for the specified node
 *
 * @export
 * @param {ZoweNode} node
 */
export function getProfile(node: ZoweNode) {
    let profile = node.getSessionNode().mLabel;
    return profile;
}

/**
 * Returns the local file path for the ZoweNode
 *
 * @export
 * @param {ZoweNode} node
 */
export function getDocumentFilePath(node: ZoweNode) {
    return path.join(BRIGHTTEMPFOLDER, "/" + getProfile(node) + "/", node.pattern);
}

/**
 * Downloads and displays a file in a text editor view
 *
 * @param {ZoweNode} node
 */
export async function open(node: ZoweNode) {
    try {
        let label: string;
        switch (node.mParent.contextValue) {
            case ("directory"):
                label = node.pattern;
                break;
            case ("session"):
                label = node.mLabel;
                break;
            default:
                vscode.window.showErrorMessage("open() called from invalid node.");
                throw Error("open() called from invalid node.");
        }
        // if local copy exists, open that instead of pulling from mainframe
        if (!fs.existsSync(getDocumentFilePath(node))) {
            await zowe.Download.ussFile(node.getSession(), node.pattern, {
                file: getDocumentFilePath(node)
            });
        }
        const document = await vscode.workspace.openTextDocument(getDocumentFilePath(node));
        await vscode.window.showTextDocument(document);
    } catch (err) {
        vscode.window.showErrorMessage(err.message);
        throw (err);
    }
}

/**
 * Refreshes treeView
 *
 * @param {USSTree} ussFileProvider
 */
export async function refreshAll(ussFileProvider: USSTree) {
    ussFileProvider.mSessionNodes.forEach((node) => {
        node.dirty = true;
    });
    ussFileProvider.refresh();
}

/**
 * Refreshes the passed node with current mainframe data
 *
 * @param {ZoweNode} node - The node which represents the dataset
 */
export async function refreshPS(node: ZoweNode) {
    let label;
    switch (node.mParent.contextValue) {
        case ("directory"):
            label = node.pattern;
            break;
        case ("session"):
            label = node.mLabel;
            break;
        default:
            vscode.window.showErrorMessage("refreshPS() called from invalid node.");
            throw Error("refreshPS() called from invalid node.");
    }
    try {
        await zowe.Download.ussFile(node.getSession(), node.pattern,{
            file: getDocumentFilePath(node)
        });
        const document = await vscode.workspace.openTextDocument(getDocumentFilePath(node));
        vscode.window.showTextDocument(document);
        // if there are unsaved changes, vscode won't automatically display the updates, so close and reopen
        if (document.isDirty) {
            await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            vscode.window.showTextDocument(document);
        }
    } catch (err) {
        if (err.message.includes("not found")) {
            vscode.window.showInformationMessage(`Unable to find file: ${label} was probably deleted.`);
        } else {
            vscode.window.showErrorMessage(err);
        }
    }
}