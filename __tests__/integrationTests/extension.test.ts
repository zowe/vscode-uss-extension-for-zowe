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

// tslint:disable:no-magic-numbers
import * as zowe from "@brightside/core";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as extension from "../../src/extension";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as sinon from "sinon";
import * as testConst from "../../resources/testProfileData";
import * as vscode from "vscode";
import { CliProfileManager } from "@brightside/imperative";
import { USSTree } from "../../src/USSTree";
import { ZoweUSSNode } from "../../src/ZoweUSSNode";

const TIMEOUT = 45000;
declare var it: Mocha.ITestDefinition;

describe("Extension Integration Tests", () => {
    const folder = extension.BRIGHTTEMPFOLDER;

    const expect = chai.expect;
    chai.use(chaiAsPromised);


    const session = zowe.ZosmfSession.createBasicZosmfSession(testConst.profile);
    const sessionNode = new ZoweUSSNode(testConst.profile.name, vscode.TreeItemCollapsibleState.Expanded, null, session, null);
    sessionNode.contextValue = "uss_session";
    const fullPath = testConst.normalPattern;
    sessionNode.fullPath = fullPath;
    const testTree = new USSTree();
    testTree.mSessionNodes.splice(-1, 0, sessionNode);

    let sandbox;

    beforeEach(async function() {
        this.timeout(TIMEOUT);
        sandbox = sinon.createSandbox();
        await extension.deactivate();
    });

    afterEach(async function() {
        this.timeout(TIMEOUT);
        sandbox.restore();
    });

    describe("TreeView", () => {
        it("should create the TreeView", async () => {
            // Initialize uss file provider
            const ussFileProvider = new USSTree();

            // Create the TreeView using ussFileProvider to create tree structure
            const testTreeView = vscode.window.createTreeView("zowe.uss.explorer", {treeDataProvider: ussFileProvider});

            const allNodes = await getAllNodes(ussFileProvider.mSessionNodes);
            for (const node of allNodes) {
                // For each node, select that node in TreeView by calling reveal()
                await testTreeView.reveal(node);
                // Test that the node is successfully selected
                expect(node).to.deep.equal(testTreeView.selection[0]);
            }
            testTreeView.dispose();
        }).timeout(TIMEOUT);
    });

    describe("Creating a Session", () => {
        it("should add a session", async () => {
            // Grab profiles
            const profileManager = await new CliProfileManager({
                profileRootDirectory: path.join(os.homedir(), ".zowe", "profiles"),
                type: "zosmf"
            });
            const profileNamesList = profileManager.getAllProfileNames().filter((profileName) =>
                // Find all cases where a profile is not already displayed
                !testTree.mSessionNodes.find((node) =>
                    node.mLabel.toUpperCase() === profileName.toUpperCase()
                )
            );

            // Mock user selecting first profile from list
            const stub = sandbox.stub(vscode.window, "showQuickPick");
            stub.returns(profileNamesList[0]);

            await extension.addSession(testTree);
            expect(testTree.mSessionNodes[testTree.mSessionNodes.length - 1].mLabel).to.equal(profileNamesList[0]);
        }).timeout(TIMEOUT);
    });

    describe("Deactivate", () => {
        it("should clean up the local files when deactivate is invoked", async () => {
            try {
                fs.mkdirSync(folder);
            } catch (err) {
                // if operation failed, wait a second and try again
                await new Promise((resolve) => setTimeout(resolve, 1000));
                fs.mkdirSync(folder);
            }
            fs.closeSync(fs.openSync(path.join(folder, "file1"), "w"));
            fs.closeSync(fs.openSync(path.join(folder, "file2"), "w"));
            await extension.deactivate();
            expect(fs.existsSync(path.join(folder, "file1"))).to.equal(false);
            expect(fs.existsSync(path.join(folder, "file2"))).to.equal(false);
        }).timeout(TIMEOUT);
    });

    describe("Enter Pattern", () => {
        it("should output path that match the user-provided path", async () => {
            const inputBoxStub = sandbox.stub(vscode.window, "showInputBox");
            inputBoxStub.returns(fullPath);

            await extension.enterPattern(sessionNode, testTree);

            expect(testTree.mSessionNodes[0].fullPath).to.equal(fullPath);
            expect(testTree.mSessionNodes[0].tooltip).to.equal(fullPath);
            expect(testTree.mSessionNodes[0].collapsibleState).to.equal(vscode.TreeItemCollapsibleState.Expanded);

            // const testTreeView = vscode.window.createTreeView("zowe.uss.explorer", {treeDataProvider: testTree});

            // const childrenFromTree = await sessionNode.getChildren();
            // childrenFromTree.unshift(...(await childrenFromTree[0].getChildren()));

            // for (const child of childrenFromTree) {
            //     await testTreeView.reveal(child);
            //     expect(child).to.deep.equal(testTreeView.selection[0]);
            // }
        }).timeout(TIMEOUT);

        it("should pop up a message if the user doesn't enter a path", async () => {
            const inputBoxStub = sandbox.stub(vscode.window, "showInputBox");
            inputBoxStub.returns("");

            const showInfoStub = sandbox.spy(vscode.window, "showInformationMessage");
            await extension.enterPattern(sessionNode, testTree);
            const gotCalled = showInfoStub.calledWith("You must enter a path.");
            expect(gotCalled).to.equal(true);
        }).timeout(TIMEOUT);
    });
    describe("Saving a File", () => {

        it("should download, change, and re-upload a file", async () => {
            const changedData = "File Upload Test "+ Math.random().toString(36).slice(2);

            const rootChildren = await testTree.getChildren();
            rootChildren[0].dirty = true;
            const sessChildren1 = await testTree.getChildren(rootChildren[0]);
            sessChildren1[3].dirty = true;
            const sessChildren2 = await testTree.getChildren(sessChildren1[3]);
            sessChildren2[2].dirty = true;
            const dirChildren = await testTree.getChildren(sessChildren2[2]);
            const localPath = path.join(extension.BRIGHTTEMPFOLDER, "/",  testConst.profile.name,
            dirChildren[0].fullPath + "[" + testConst.profile.name + "]");

            await extension.open(dirChildren[0]);
            let doc = await vscode.workspace.openTextDocument(localPath);

            const originalData = doc.getText().trim();

            // write new data
            fs.writeFileSync(localPath, changedData);
    
            // Upload file
            await extension.saveFile(doc, testTree);
            await fs.unlinkSync(localPath);
            
            // Download file
            await extension.open(dirChildren[0]);
   
            // Change contents back
            fs.writeFileSync(localPath, originalData);
            await extension.saveFile(doc, testTree);
        }).timeout(TIMEOUT);
    });
});

/*************************************************************************************************************
 * Returns array of all subnodes of given node
 *************************************************************************************************************/
async function getAllNodes(nodes: ZoweUSSNode[]) {
    let allNodes = new Array<ZoweUSSNode>();

    for (const node of nodes) {
        allNodes = allNodes.concat(await getAllNodes(await node.getChildren()));
        allNodes.push(node);
    }

    return allNodes;
}
