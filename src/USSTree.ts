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
import { CliProfileManager } from "@brightside/imperative";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { ZoweNode } from "./ZoweNode";

/**
 * A tree that contains nodes of sessions and USS Files
 *
 * @export
 * @class USSTree
 * @implements {vscode.TreeDataProvider}
 */
export class USSTree implements vscode.TreeDataProvider<ZoweNode> {
    public mSessionNodes: ZoweNode[];

    // Event Emitters used to notify subscribers that the refresh event has fired
    public mOnDidChangeTreeData: vscode.EventEmitter<ZoweNode | undefined> = new vscode.EventEmitter<ZoweNode | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<ZoweNode | undefined> = this.mOnDidChangeTreeData.event;

    constructor() {
        this.mSessionNodes = [];
    }

    /**
     * Takes argument of type ZoweNode and returns it converted to a general [TreeItem]
     *
     * @param {ZoweNode} element
     * @returns {vscode.TreeItem}
     */
    public getTreeItem(element: ZoweNode): vscode.TreeItem {
        return element;
    }

    /**
     * Takes argument of type ZoweNode and retrieves all of the first level children
     *
     * @param {ZoweNode} [element] - Optional parameter; if not passed, returns root session nodes
     * @returns {ZoweNode[] | Promise<ZoweNode[]>}
     */
    public getChildren(element?: ZoweNode): ZoweNode[] | Promise<ZoweNode[]> {
        if (element) {
            return element.getChildren();
        }
        return this.mSessionNodes;
    }

    /**
     * Called whenever the tree needs to be refreshed, and fires the data change event
     *
     */
    public refresh(): void {
        this.mOnDidChangeTreeData.fire();
    }

    /**
     * Returns the parent node or null if it has no parent
     *
     * @param {ZoweNode} element
     * @returns {vscode.ProviderResult<ZoweNode>}
     */
    public getParent(element: ZoweNode): vscode.ProviderResult<ZoweNode> {
        return element.mParent;
    }

    /**
     * Adds a new session to the uss files tree
     *
     * @param {string} [sessionName] - optional; loads default profile if not passed
     */
    public async addSession(sessionName?: string) {
        // Loads profile associated with passed sessionName, default if none passed
        const zosmfProfile = await new CliProfileManager({

            profileRootDirectory: path.join(os.homedir(), ".zowe", "profiles"),
            type: "zosmf"
        }).load(sessionName ? {name: sessionName} : {loadDefault: true});

        // If session is already added, do nothing
        if (this.mSessionNodes.find((tempNode) => tempNode.mLabel === zosmfProfile.name)) {
            return;
        }

        // Uses loaded profile to create a zosmf session with brightside
        const session = zowe.ZosmfSession.createBasicZosmfSession(zosmfProfile.profile);

        // Creates ZoweNode to track new session and pushes it to mSessionNodes
        const node = new ZoweNode(zosmfProfile.name, vscode.TreeItemCollapsibleState.Collapsed, null, session, "");
        node.contextValue = "uss_session";
        this.mSessionNodes.push(node);
        this.refresh();
    }

    /**
     * Removes a session from the list in the uss files tree
     *
     * @param {ZoweNode} [node]
     */
    public deleteSession(node: ZoweNode) {
        // Removes deleted session from mSessionNodes
        this.mSessionNodes = this.mSessionNodes.filter((tempNode) => tempNode.label !== node.label);
        this.refresh();
    }
}