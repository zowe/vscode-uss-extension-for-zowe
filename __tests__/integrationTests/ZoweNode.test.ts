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
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
// tslint:disable-next-line:no-implicit-dependencies
import * as expect from "expect";
import * as vscode from "vscode";
import { ZoweNode } from "../../src/ZoweNode";
import * as testConst from "../../resources/testProfileData";

declare var it: any;

describe("ZoweNode Integration Tests", async () => {
    const TIMEOUT = 120000;
    chai.use(chaiAsPromised);
    // Uses loaded profile to create a zosmf session with brightside
    const session = zowe.ZosmfSession.createBasicZosmfSession(testConst.profile);
    const sessNode = new ZoweNode(testConst.profile.name, vscode.TreeItemCollapsibleState.Expanded, null, session,null);
    sessNode.contextValue = "session";
    const path = testConst.normalPattern;
    sessNode.pattern = path + "/group";

    /*************************************************************************************************************
     * Creates an ZoweNode and checks that its members are all initialized by the constructor
     *************************************************************************************************************/
    it("Testing that the ZoweNode is defined", async () => {
        // Tests empty node
        const emptyPONode = new ZoweNode(path + "/aDir4", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);

        expect(emptyPONode.label).toBeDefined();
        expect(emptyPONode.collapsibleState).toBeDefined();
        // sexpect(emptyPONode.getParent()).toBeDefined();

        // Tests PS node
        const PSNode = new ZoweNode(path + "/aFile3.txt", vscode.TreeItemCollapsibleState.None, sessNode, null, null);

        expect(PSNode.label).toBeDefined();
        expect(PSNode.collapsibleState).toBeDefined();
        //expect(PSNode.getParent()).toBeDefined();
    });

    /*************************************************************************************************************
     * Checks that the ZoweNode constructor works as expected when the label parameter is the empty string
     *************************************************************************************************************/
    it("Testing that the ZoweNode constructor works as expected when the label parameter is the empty string", async () => {
        // The ZoweNode should still be constructed, and should not throw an error.
        const edgeNode = new ZoweNode("", vscode.TreeItemCollapsibleState.None, sessNode, null, null);

        expect(edgeNode.label).toBeDefined();
        expect(edgeNode.collapsibleState).toBeDefined();
        //expect(edgeNode.mParent).toBeDefined();
    });

    /*************************************************************************************************************
     * Creates sample ZoweNode list and checks that getChildren() returns the correct array
     *************************************************************************************************************/
    it("Testing that getChildren returns the correct Thenable<ZoweNode[]>", async () => {
        let sessChildren;
        try {
            sessChildren = await sessNode.getChildren();
        }
        catch (err) {
            throw (err);
        }

        // Creating structure of files and directories
        const sampleChildren: ZoweNode[] = [
            new ZoweNode(path + "/group/aDir3", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null),
            new ZoweNode(path + "/group/aDir4", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null),
            new ZoweNode(path + "/group/aDir5", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null),
            new ZoweNode(path + "/group/aDir6", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null),
        ];

        sampleChildren[0].command = { command: "zowe.ZoweNode.open", title: "", arguments: [sampleChildren[0]] };
        // tslint:disable-next-line:no-magic-numbers
        sampleChildren[1].command = { command: "zowe.ZoweNode.open", title: "", arguments: [sampleChildren[1]] };

        // Checking that the rootChildren are what they are expected to be
        expect(sessChildren.length).toBe(4);
        expect(sessChildren[0].label).toBe("aDir3");
        expect(sessChildren[1].label).toBe("aDir4");
    }).timeout(TIMEOUT);

    /*************************************************************************************************************
     * Checks that getChildren() returns the expected value when passed an ZoweNode with all null parameters
     *************************************************************************************************************/
    it("Testing that getChildren works as expected on the null value", async () => {
        const expectChai = chai.expect;
        chai.use(chaiAsPromised);

        // The method should throw an error.
        const nullNode = new ZoweNode(null, null, null, null, null);
        nullNode.contextValue = "pds";
        await expectChai(nullNode.getChildren()).to.eventually.be.rejectedWith("Invalid node");
    }).timeout(TIMEOUT);

    /*************************************************************************************************************
     * Checks that getChildren() returns the expected value when passed an ZoweNode with undefined parameters
     *************************************************************************************************************/
    it("Testing that getChildren works as expected on an undefined value", async () => {
        const expectChai = chai.expect;
        chai.use(chaiAsPromised);

        // The method should throw an error.
        const undefinedNode = new ZoweNode(undefined, undefined, undefined, undefined, undefined);
        undefinedNode.contextValue = "pds";
        // tslint:disable-next-line:max-line-length
        await expectChai(undefinedNode.getChildren()).to.eventually.be.rejectedWith("Invalid node");

    }).timeout(TIMEOUT);

    /*************************************************************************************************************
    * Checks that getChildren() returns the expected value when passed an empty directory
    *************************************************************************************************************/
    it("Testing that getChildren works as expected on an empty directory", async () => {
        // The method should return an empty array.
        const PSNode = new ZoweNode(path + "/aDir6", vscode.TreeItemCollapsibleState.None, sessNode, null, null);
        let PSNodeChildren;
        try {
            PSNodeChildren = await PSNode.getChildren();
        }
        catch (err) {
            throw (err);
        }

        expect(PSNodeChildren).toEqual([]);

    }).timeout(TIMEOUT);

    /*************************************************************************************************************
     * Checks that getSession() returns the expected value
     *************************************************************************************************************/
    it("Testing that getSession() works as expected", async () => {
        const dir1 = new ZoweNode(path + "./aDir5", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);
        const dir2 = new ZoweNode(path + "/aDir6", vscode.TreeItemCollapsibleState.None, sessNode, null, null);
        const file1 = new ZoweNode(path + "/aDir5/aFile4.txt", vscode.TreeItemCollapsibleState.None, dir1, null, null);

        expect(sessNode.getSession()).toEqual(session);
        expect(dir1.getSession()).toEqual(session);
        expect(dir2.getSession()).toEqual(session);
        expect(file1.getSession()).toEqual(session);

    }).timeout(TIMEOUT);
});
