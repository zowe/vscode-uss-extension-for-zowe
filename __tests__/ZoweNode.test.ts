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

// tslint:disable:no-shadowed-variable
jest.mock("vscode");
jest.mock("@brightside/imperative");
jest.mock("@brightside/core/lib/zosfiles/src/api/methods/list/doc/IListOptions");
jest.mock("Session");
import { Session } from "@brightside/imperative";
import * as vscode from "vscode";
import { ZoweNode } from "../src/ZoweNode";

describe("Unit Tests (Jest)", async () => {
    // Globals
    const session = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        protocol: "https",
        type: "basic",
    });

    /*************************************************************************************************************
     * Creates an ZoweNode and checks that its members are all initialized by the constructor
     *************************************************************************************************************/
    it("Testing that the ZoweNode is defined", async () => {
        const testNode = new ZoweNode("/u", vscode.TreeItemCollapsibleState.None, null, session,null);
        testNode.contextValue = "session";

        expect(testNode.label).toBeDefined();
        expect(testNode.collapsibleState).toBeDefined();
        expect(testNode.mLabel).toBeDefined();
        expect(testNode.mParent).toBeDefined();
        expect(testNode.getSession()).toBeDefined();
    });

    /*************************************************************************************************************
     * Creates sample ZoweNode list and checks that getChildren() returns the correct array
     *************************************************************************************************************/
    it("Testing that getChildren returns the correct Thenable<ZoweNode[]>", async () => {
        // Creating a rootNode
        const rootNode = new ZoweNode("/u", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        rootNode.contextValue = "directory";

        // Creating structure of files and directories
        const elementChildren = {};
        const sampleChildren: ZoweNode[] = [
            new ZoweNode("aDir", vscode.TreeItemCollapsibleState.Collapsed, rootNode, session, "/u"),
            new ZoweNode("myFile.txt", vscode.TreeItemCollapsibleState.None, rootNode, session, "/u"),

        ];
        sampleChildren[1].command = { command: "zowe.ZoweNode.open", title: "Open", arguments: [sampleChildren[1]] };

        let rootChildren = await rootNode.getChildren();
        expect(rootChildren.length).toBe(2);
        expect(rootChildren[0].label).toBe("aDir");
        expect(rootChildren[1].label).toBe("myFile.txt");

        rootChildren[0].dirty = false;
        await rootChildren[0].getChildren();
        expect(rootChildren[0].children.length).toBe(0);

        // Check that error is thrown when mLabel is blank
        const errorNode = new ZoweNode("", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        await expect(errorNode.getChildren()).rejects.toEqual(Error("Invalid node"));

        // Check that label is different when mLabel contains a []
        const rootNode2 = new ZoweNode("root[test]", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        rootChildren = await rootNode2.getChildren();
    });

    /*************************************************************************************************************
     * Checks that the catch block is reached when an error is thrown
     *************************************************************************************************************/
    it("Checks that when bright.List.dataSet/allMembers() causes an error on the brightside call, " +
        "it throws an error and the catch block is reached", async () => {
            // Creating a rootNode
            const rootNode = new ZoweNode("toot", vscode.TreeItemCollapsibleState.Collapsed, null, session, "root");
            rootNode.contextValue = "session";
            rootNode.pattern = "Throw Error";
            await expect(rootNode.getChildren()).rejects.toEqual(Error("Retrieving response from zowe.List\n" +
                "Error: Throwing an error to check error handling for unit tests!\n"));
        });

    /*************************************************************************************************************
     * Checks that returning an unsuccessful response results in an error being thrown and caught
     *************************************************************************************************************/
    it("Checks that when bright.List.dataSet/allMembers() returns an unsuccessful response, " +
        "it throws an error and the catch block is reached", async () => {
            // Creating a rootNode
            const rootNode = new ZoweNode("toot", vscode.TreeItemCollapsibleState.Collapsed, null, session, "root");
            rootNode.contextValue = "session";
            const subNode = new ZoweNode("Response Fail", vscode.TreeItemCollapsibleState.Collapsed, rootNode, null, null);
            subNode.pattern = "Response Fail";
            await expect(subNode.getChildren()).rejects.toEqual(Error("The response from Zowe CLI was not successful"));
        });

    /*************************************************************************************************************
     * Checks that passing a session node that is not dirty ignores the getChildren() method
     *************************************************************************************************************/
    it("Checks that passing a session node that is not dirty the getChildren() method is exited early", async () => {
        // Creating a rootNode
        const rootNode = new ZoweNode("root", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        rootNode.contextValue = "session";
        rootNode.dirty = false;
        await expect(await rootNode.getChildren()).toEqual([]);
    });

    /*************************************************************************************************************
     * Checks that passing a session node with no hlq ignores the getChildren() method
     *************************************************************************************************************/
    it("Checks that passing a session node with no hlq the getChildren() method is exited early", async () => {
        // Creating a rootNode
        const rootNode = new ZoweNode("root", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        rootNode.contextValue = "session";
        await expect(await rootNode.getChildren()).toEqual([]);
    });

    /*************************************************************************************************************
     * Checks that when getSession() is called on a memeber it returns the proper session
     *************************************************************************************************************/
    it("Checks that a member can reach its session properly", async () => {
        // Creating a rootNode
        const rootNode = new ZoweNode("root", vscode.TreeItemCollapsibleState.Collapsed, null, session, null);
        rootNode.contextValue = "session";
        const subNode = new ZoweNode("pds", vscode.TreeItemCollapsibleState.Collapsed, rootNode, null, null);
        const member = new ZoweNode("member", vscode.TreeItemCollapsibleState.None, subNode, null, null);
        await expect(member.getSession()).toBeDefined();
    });
});
