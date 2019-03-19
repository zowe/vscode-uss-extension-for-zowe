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
import { Session } from "@brightside/imperative";
import * as vscode from "vscode";

/**
 * A type of TreeItem used to represent sessions and USS directories and files
 *
 * @export
 * @class ZoweNode
 * @extends {vscode.TreeItem}
 */
export class ZoweNode extends vscode.TreeItem {
    public command: vscode.Command;
    public pattern = "";
    public dirty = true;
    public children: ZoweNode[] = [];

    /**
     * Creates an instance of ZoweNode
     *
     * @param {string} mLabel - Displayed in the [TreeView]
     * @param {vscode.TreeItemCollapsibleState} mCollapsibleState - file/directory
     * @param {ZoweNode} mParent
     * @param {Session} session
     */
    constructor(public mLabel: string, public mCollapsibleState: vscode.TreeItemCollapsibleState,
                public mParent: ZoweNode, private session: Session, private parentPath) {
        super(mLabel, mCollapsibleState);
        if (mCollapsibleState !== vscode.TreeItemCollapsibleState.None) {
            this.contextValue = "directory";
        } else {
            this.contextValue = "file";
        }
        if (parentPath)
            this.pattern = this.tooltip = parentPath+'/'+mLabel;
    }

    /**
     * Retrieves child nodes of this ZoweNode
     *
     * @returns {Promise<ZoweNode[]>}
     */
    public async getChildren(): Promise<ZoweNode[]> {
        if ((!this.pattern && this.contextValue === "session") || this.contextValue === "file") {
            return [];
        }

        if (!this.dirty) {
            return this.children;
        }

        if (!this.mLabel) {
            vscode.window.showErrorMessage("Invalid node");
            throw Error("Invalid node");
        }

        // Gets the directories from the pattern and displays any thrown errors
        const responses: zowe.IZosFilesResponse[] = [];
        let response: any;
        try {
            responses.push(await zowe.List.fileList(this.getSession(), this.pattern));
        } catch (err) {
            vscode.window.showErrorMessage(`Retrieving response from zowe.List\n${err}\n`);
            throw Error(`Retrieving response from zowe.List\n${err}\n`);
        }

        // push nodes to an object with property names to avoid duplicates
        const elementChildren = {};
        let fullPath;
        responses.forEach((response) => {
            // Throws reject if the brightside command does not throw an error but does not succeed
            if (!response.success) {
                throw Error("The response from Zowe CLI was not successful");
            }

            // Loops through all the returned file references members and creates nodes for them
            for (const item of response.apiResponse.items) {
                if (item.name !== '.' && item.name !== '..') {
                    // Creates a ZoweNode for a directory
                    if (item.mode.startsWith('d')) {
                        const temp = new ZoweNode(item.name, vscode.TreeItemCollapsibleState.Collapsed, this, this.session, this.pattern);
                        elementChildren[temp.label] = temp;
                    } else {
                        // Creates a ZoweNode for a file
                        const temp = new ZoweNode(item.name, vscode.TreeItemCollapsibleState.None, this, this.session, this.pattern);
                        temp.command = {command: "zowe.ZoweNode.open", title: "Open", arguments: [temp]};
                        elementChildren[temp.label] = temp;
                    }
                }
            }
        });

        if (this.contextValue === "session") {
            this.dirty = false;
        }
        return this.children = Object.keys(elementChildren).sort().map((labels) => elementChildren[labels]);
    }

    /**
     * Returns the [Session] for this node
     *
     * @returns {Session}
     */
    public getSession(): Session {
        return this.session || this.mParent.getSession();
    }

    /**
     * Returs the session node for this node
     *
     * @returns {ZoweNode}
     */
    public getSessionNode(): ZoweNode {
        return this.session ? this : this.mParent.getSessionNode();
    }
}
