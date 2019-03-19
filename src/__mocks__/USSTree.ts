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

import * as vscode from "vscode";
import { ZoweNode } from "../ZoweNode";
import { MockMethod } from "../decorators/MockMethod";

/**
 * A tree that contains nodes of files and folders
 *
 * @export
 * @class USSTree
 * @implements {vscode.TreeDataProvider}
 */
export class USSTree implements vscode.TreeDataProvider<ZoweNode> {
    public mSessionNodes: ZoweNode[] = [];

    // Event Emitters used to notify subscribers that the refresh event has fired
    public mOnDidChangeTreeData: vscode.EventEmitter<ZoweNode | undefined> = new vscode.EventEmitter<ZoweNode | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<ZoweNode | undefined> = this.mOnDidChangeTreeData.event;

    /**
     * Takes argument of type ZoweNode and returns it converted to a general [TreeItem]
     *
     * @param {ZoweNode} element - The ZoweNode that is to be converted
     * @returns {vscode.TreeItem}
     * @memberof USSTree
     */
    @MockMethod()
    public getTreeItem(element: ZoweNode): vscode.TreeItem {
        return null;
    }

    /**
     * Takes argument of type ZoweNode and retrieves all of the first level children
     *
     * @param {ZoweNode} [element] - The ZoweNode that is to be converted
     * @returns {Thenable<ZoweNode[]>}
     * @memberof USSTree
     */
    @MockMethod()
    public getChildren(element?: ZoweNode): Promise<ZoweNode[]> {
        return new Promise<ZoweNode[]>((resolve) => {
            return resolve(null);
        });
    }

    /**
     * Called whenever the tree needs to be refreshed, and fires the data change event
     *
     * @memberof USSTree
     */
    @MockMethod()
    public refresh(): void {
        return null;
    }

    /**
     * Check if the parent exists, and return null if it has no parent
     *
     * @param {ZoweNode} element - The ZoweNode of which to retrieve the parent
     * @returns {vscode.ProviderResult<ZoweNode>}
     * @memberof USSTree
     */
    @MockMethod()
    public getParent(element: ZoweNode): vscode.ProviderResult<ZoweNode> {
        return null;
    }

    @MockMethod()
    public async addSession(sessionName?: string): Promise<void> {
        return new Promise<void>((resolve) => {
            return resolve();
        });
    }

    @MockMethod()
    public async deleteSession(node?: ZoweNode): Promise<void> {
        return new Promise<void>((resolve) => {
            return resolve();
        });
    }
}
