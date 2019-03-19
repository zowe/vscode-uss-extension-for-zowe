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
jest.mock("fs");
jest.mock("vscode");
jest.mock("Session");
jest.mock("@brightside/core");
jest.mock("@brightside/imperative");
jest.mock("../src/USSTree");
import * as vscode from "vscode";
import * as treeMock from "../src/USSTree";
import { ZoweNode } from "../src/ZoweNode";
import * as brtimperative from "@brightside/imperative";
import * as extension from "../src/extension";
import * as path from "path";
import * as brightside from "@brightside/core";
import * as fs from "fs";

describe("Extension Unit Tests", async () => {
    // Globals
    const session = new brtimperative.Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        protocol: "https",
        type: "basic",
    });

    const sessNode = new ZoweNode("sestest", vscode.TreeItemCollapsibleState.Expanded, null, session, null);
    sessNode.contextValue = "session";
    sessNode.pattern = "/u/myuser";

    const mkdirSync = jest.fn();
    const getAllProfileNames = jest.fn();
    const createTreeView = jest.fn();
    const Uri = jest.fn();
    const registerCommand = jest.fn();
    const onDidSaveTextDocument = jest.fn();
    const existsSync = jest.fn();
    const createReadStream = jest.fn();
    const readdirSync = jest.fn();
    const unlinkSync = jest.fn();
    const rmdirSync = jest.fn();
    const readFileSync = jest.fn();
    const showErrorMessage = jest.fn();
    const showInputBox = jest.fn();
    const ZosmfSession = jest.fn();
    const createBasicZosmfSession = jest.fn();
    const Upload = jest.fn();
    const bufferToDataSet = jest.fn();
    const pathToDataSet = jest.fn();
    const Create = jest.fn();
    const dataSetCreate = jest.fn();
    const Download = jest.fn();
    const ussFile = jest.fn();
    const List = jest.fn();
    const dataSetList = jest.fn();
    const openTextDocument = jest.fn();
    const showTextDocument = jest.fn();
    const showInformationMessage = jest.fn();
    const showQuickPick = jest.fn();
    const mockAddSession = jest.fn();
    const mockRefresh = jest.fn();
    const mockGetChildren = jest.fn();
    const onDidChangeConfiguration = jest.fn();
    const executeCommand = jest.fn();
    const activeTextEditor = jest.fn();
    const document = jest.fn();
    const save = jest.fn();
    const isFile = jest.fn();
    const initLogger = jest.fn();
    const CliProfileManager = jest.fn().mockImplementation(() => {
        return { getAllProfileNames };
    });
    const Logger = jest.fn().mockImplementation(() => {
        return { initLogger };
    });
    const lstatSync = jest.fn().mockImplementation(() => {
        return { lstat };
    });
    const lstat = jest.fn().mockImplementation(() => {
        return { isFile };
    });
    const USSTree = jest.fn().mockImplementation(() => {
        // tslint:disable-next-line:max-line-length
        return {
            mSessionNodes: [],
            addSession: mockAddSession,
            refresh: mockRefresh,
            getChildren: mockGetChildren,
        };
    });

    const testTree = USSTree();
    testTree.mSessionNodes = [];
    testTree.mSessionNodes.push(sessNode);

    Object.defineProperty(fs, "mkdirSync", { value: mkdirSync });
    Object.defineProperty(brtimperative, "CliProfileManager", { value: CliProfileManager });
    Object.defineProperty(brtimperative, "Logger", { value: Logger });
    Object.defineProperty(vscode.window, "createTreeView", { value: createTreeView });
    Object.defineProperty(vscode, "Uri", { value: Uri });
    Object.defineProperty(vscode.commands, "registerCommand", { value: registerCommand });
    Object.defineProperty(vscode.workspace, "onDidSaveTextDocument", { value: onDidSaveTextDocument });
    Object.defineProperty(vscode.workspace, "onDidChangeConfiguration", { value: onDidChangeConfiguration });
    Object.defineProperty(fs, "readdirSync", { value: readdirSync });
    Object.defineProperty(fs, "createReadStream", { value: createReadStream });
    Object.defineProperty(fs, "existsSync", { value: existsSync });
    Object.defineProperty(fs, "unlinkSync", { value: unlinkSync });
    Object.defineProperty(fs, "lstatSync", { value: lstatSync });
    Object.defineProperty(fs, "rmdirSync", { value: rmdirSync });
    Object.defineProperty(fs, "readFileSync", { value: readFileSync });
    Object.defineProperty(vscode.window, "showErrorMessage", { value: showErrorMessage });
    Object.defineProperty(vscode.window, "showInputBox", { value: showInputBox });
    Object.defineProperty(vscode.window, "activeTextEditor", { value: activeTextEditor });
    Object.defineProperty(activeTextEditor, "document", { value: document });
    Object.defineProperty(document, "save", { value: save });
    Object.defineProperty(vscode.commands, "executeCommand", { value: executeCommand });
    Object.defineProperty(brightside, "ZosmfSession", { value: ZosmfSession });
    Object.defineProperty(ZosmfSession, "createBasicZosmfSession", { value: createBasicZosmfSession });
    Object.defineProperty(brightside, "Upload", { value: Upload });
    Object.defineProperty(Upload, "bufferToDataSet", { value: bufferToDataSet });
    Object.defineProperty(Upload, "pathToDataSet", { value: pathToDataSet });
    Object.defineProperty(brightside, "Create", { value: Create });
    Object.defineProperty(Create, "dataSet", { value: dataSetCreate });
    Object.defineProperty(brightside, "List", { value: List });
    Object.defineProperty(List, "dataSet", { value: dataSetList });
    Object.defineProperty(vscode.workspace, "openTextDocument", { value: openTextDocument });
    Object.defineProperty(vscode.window, "showInformationMessage", { value: showInformationMessage });
    Object.defineProperty(vscode.window, "showTextDocument", { value: showTextDocument });
    Object.defineProperty(vscode.window, "showErrorMessage", { value: showErrorMessage });
    Object.defineProperty(vscode.window, "showQuickPick", { value: showQuickPick });
    Object.defineProperty(brightside, "Download", { value: Download });
    Object.defineProperty(Download, "ussFile", { value: ussFile });
    Object.defineProperty(treeMock, "USSTree", { value: USSTree });
    Object.defineProperty(lstat, "isFile", { value: isFile });

    it("Testing that activate correctly executes", async () => {
        // Handle the deactivate - start
        existsSync.mockReturnValue(true);
        readdirSync.mockReturnValueOnce(["firstFile", "secondFile"]);
        isFile.mockReturnValueOnce(true);
        readdirSync.mockReturnValueOnce(["thirdFile"]);
        readdirSync.mockReturnValue([]);
        lstatSync.mockReturnValue(lstat);
        isFile.mockReturnValueOnce(false);
        const extensionMock = jest.fn(() => (<vscode.ExtensionContext>{
            subscriptions: [],
            extensionPath: path.join(__dirname, "..")
        }));
        const mock = new extensionMock();

        await extension.activate(mock);

        expect(existsSync.mock.calls.length).toBe(4);
        expect(existsSync.mock.calls[0][0]).toBe(extension.BRIGHTTEMPFOLDER);
        expect(readdirSync.mock.calls.length).toBe(3);
        expect(readdirSync.mock.calls[0][0]).toBe(extension.BRIGHTTEMPFOLDER);
        expect(unlinkSync.mock.calls.length).toBe(1);
        expect(unlinkSync.mock.calls[0][0]).toBe(path.join(extension.BRIGHTTEMPFOLDER + "/firstFile"));
        expect(rmdirSync.mock.calls.length).toBe(3);
        expect(rmdirSync.mock.calls[0][0]).toBe(extension.BRIGHTTEMPFOLDER + "/secondFile/thirdFile");
        expect(rmdirSync.mock.calls[1][0]).toBe(extension.BRIGHTTEMPFOLDER + "/secondFile");
        expect(rmdirSync.mock.calls[2][0]).toBe(extension.BRIGHTTEMPFOLDER);

        existsSync.mockReset();
        readdirSync.mockReset();
        // Handle the deactivate - end

        // Can't explain this but doesn't hurt
        expect(showErrorMessage.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls[0][0]).toBe("imperative_1.Logger.initLogger is not a function");
        showErrorMessage.mockReset();

        expect(mkdirSync.mock.calls.length).toBe(1);
        createTreeView.mockReturnValueOnce("testDisposable");
        expect(createTreeView.mock.calls.length).toBe(1);
        expect(createTreeView.mock.calls[0][0]).toBe("zowe.explorer");

        // vscode commands section
        expect(registerCommand.mock.calls.length).toBe(6);
        expect(registerCommand.mock.calls[0][0]).toBe("zowe.addSession");
        expect(registerCommand.mock.calls[0][1]).toBeInstanceOf(Function);
        expect(registerCommand.mock.calls[1][0]).toBe("zowe.refreshAll");
        expect(registerCommand.mock.calls[1][1]).toBeInstanceOf(Function);
        expect(registerCommand.mock.calls[2][0]).toBe("zowe.refreshNode");
        expect(registerCommand.mock.calls[2][1]).toBeInstanceOf(Function);
        expect(registerCommand.mock.calls[3][0]).toBe("zowe.pattern");
        expect(registerCommand.mock.calls[3][1]).toBeInstanceOf(Function);
        expect(registerCommand.mock.calls[4][0]).toBe("zowe.ZoweNode.open");
        expect(registerCommand.mock.calls[4][1]).toBeInstanceOf(Function);
        expect(registerCommand.mock.calls[5][0]).toBe("zowe.removeSession");
        expect(registerCommand.mock.calls[5][1]).toBeInstanceOf(Function);
        expect(showErrorMessage.mock.calls.length).toBe(0);

        existsSync.mockReturnValueOnce(false);

        await extension.activate(mock);

        expect(existsSync.mock.calls.length).toBe(1);
        expect(readdirSync.mock.calls.length).toBe(0);

        showErrorMessage.mockReset();
        existsSync.mockReset();
        readdirSync.mockReset();

        // breaking the deactivate loop
        existsSync.mockReturnValueOnce(true);
        existsSync.mockReturnValueOnce(true);
        existsSync.mockReturnValue(true);
        readdirSync.mockImplementation(() => {
            throw new Error();
        });
        await extension.activate(mock);

        expect(showErrorMessage.mock.calls.length).toBe(2);
        expect(showErrorMessage.mock.calls[0][0]).toBe("Unable to delete temporary folder.Error");
        expect(showErrorMessage.mock.calls[1][0]).toBe("imperative_1.Logger.initLogger is not a function");

        showErrorMessage.mockReset();

        // alternative exit point edge case in loop
        existsSync.mockReturnValueOnce(true);
        existsSync.mockReturnValueOnce(false);

        await extension.activate(mock);

        expect(showErrorMessage.mock.calls.length).toBe(1);

    });

    it("Testing that refreshPS correctly executes with and without error", async () => {
        const node = new ZoweNode("node", vscode.TreeItemCollapsibleState.None, sessNode, null, null);
        const parent = new ZoweNode("parent", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);
        const child = new ZoweNode("child", vscode.TreeItemCollapsibleState.None, parent, null, null);

        showErrorMessage.mockReset();
        openTextDocument.mockReset();
        openTextDocument.mockResolvedValueOnce({ isDirty: true });
        ussFile.mockReset();
        showTextDocument.mockReset();

        await extension.refreshPS(node);

        expect(ussFile.mock.calls.length).toBe(1);
        expect(ussFile.mock.calls[0][0]).toBe(node.getSession());
        expect(ussFile.mock.calls[0][1]).toBe(node.pattern);
        expect(ussFile.mock.calls[0][2]).toEqual({
            file: extension.getDocumentFilePath(node)
        });
        expect(openTextDocument.mock.calls.length).toBe(1);
        expect(openTextDocument.mock.calls[0][0]).toBe(path.join(extension.getDocumentFilePath(node)));
        expect(showTextDocument.mock.calls.length).toBe(2);
        expect(executeCommand.mock.calls.length).toBe(1);


        showInformationMessage.mockReset();
        openTextDocument.mockResolvedValueOnce({ isDirty: false });
        executeCommand.mockReset();

        await extension.refreshPS(node);

        expect(executeCommand.mock.calls.length).toBe(0);

        ussFile.mockRejectedValueOnce(Error("not found"));
        showInformationMessage.mockReset();

        await extension.refreshPS(node);

        expect(showInformationMessage.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls[0][0]).toBe("Unable to find file: " + node.mLabel + " was probably deleted.");

        showErrorMessage.mockReset();
        ussFile.mockReset();
        ussFile.mockRejectedValueOnce(Error(""));

        await extension.refreshPS(child);

        expect(ussFile.mock.calls[0][1]).toBe(child.pattern);
        expect(showErrorMessage.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls[0][0]).toEqual(Error(""));

        showErrorMessage.mockReset();
        openTextDocument.mockReset();
        openTextDocument.mockResolvedValueOnce({ isDirty: true });
        openTextDocument.mockResolvedValueOnce({ isDirty: true });
        ussFile.mockReset();
        showTextDocument.mockReset();

        node.contextValue = "file";
        await extension.refreshPS(node);

        node.contextValue = "directory";
        await extension.refreshPS(child);

        ussFile.mockReset();
        openTextDocument.mockReset();
        showTextDocument.mockReset();
        existsSync.mockReset();
        showErrorMessage.mockReset();

        const badparent = new ZoweNode("parent", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);
        badparent.contextValue = "turnip";
        const brat = new ZoweNode("brat", vscode.TreeItemCollapsibleState.None, badparent, null, null);
        try {
            await extension.refreshPS(brat);
        } catch (err) {
        }
        expect(ussFile.mock.calls.length).toBe(0);
        expect(showErrorMessage.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls[0][0]).toBe("refreshPS() called from invalid node.");
    });

    it("Testing that addSession is executed successfully", async () => {
        showQuickPick.mockReset();
        getAllProfileNames.mockReset();

        getAllProfileNames.mockReturnValueOnce(["firstName", "secondName"]);

        await extension.addSession(testTree);

        expect(getAllProfileNames.mock.calls.length).toBe(1);
        expect(showQuickPick.mock.calls.length).toBe(1);
        expect(showQuickPick.mock.calls[0][0]).toEqual(["firstName", "secondName"]);
        // tslint:disable-next-line
        expect(showQuickPick.mock.calls[0][1]).toEqual({
            canPickMany: false,
            ignoreFocusOut: true,
            placeHolder: "Select a Profile to Add to the Data Set Explorer"
        });

        showInformationMessage.mockReset();
        getAllProfileNames.mockReset();
        getAllProfileNames.mockReturnValueOnce(undefined);

        await extension.addSession(testTree);

        expect(getAllProfileNames.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls[0][0]).toEqual("No profiles detected");

        showInformationMessage.mockReset();
        getAllProfileNames.mockReset();
        getAllProfileNames.mockReturnValueOnce(["sestest"]);

        await extension.addSession(testTree);

        expect(getAllProfileNames.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls[0][0]).toEqual("No more profiles to add");

        showErrorMessage.mockReset();
        CliProfileManager.mockImplementationOnce(() => {
            throw (Error("testError"));
        });

        try {
            await extension.addSession(testTree);
            // tslint:disable-next-line:no-empty
        } catch (err) {
        }

        expect(showErrorMessage.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls[0][0]).toEqual("Unable to load profile manager: testError");

    });



    it("Testing that enterPattern is executed successfully", async () => {
        showInformationMessage.mockReset();
        showInputBox.mockReset();

        const node = new ZoweNode("node", vscode.TreeItemCollapsibleState.None, sessNode, null, null);
        node.pattern = "/u/test";
        node.contextValue = "session";

        showInputBox.mockReturnValueOnce("/u/test");
        await extension.enterPattern(node, testTree);

        expect(showInputBox.mock.calls.length).toBe(1);
        expect(showInputBox.mock.calls[0][0]).toEqual({
            prompt: "Search Unix System Services (USS) by entering a path name starting with a /",
            value: node.pattern
        });
        expect(showInformationMessage.mock.calls.length).toBe(0);

        showInputBox.mockReturnValueOnce("");
        showInputBox.mockReset();
        showInformationMessage.mockReset();
        await extension.enterPattern(node, testTree);

        expect(showInformationMessage.mock.calls.length).toBe(1);
        expect(showInformationMessage.mock.calls[0][0]).toBe("You must enter a path.");
    });



    it("Testing that refreshAll is executed successfully", async () => {
        extension.refreshAll(testTree);
    });

    it("Testing that open is executed successfully", async () => {
        ussFile.mockReset();
        openTextDocument.mockReset();
        showTextDocument.mockReset();
        showErrorMessage.mockReset();
        existsSync.mockReset();

        const node = new ZoweNode("node", vscode.TreeItemCollapsibleState.None, sessNode, null, null);
        const parent = new ZoweNode("parent", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);
        const child = new ZoweNode("child", vscode.TreeItemCollapsibleState.None, parent, null, null);

        existsSync.mockReturnValue(null);
        openTextDocument.mockResolvedValueOnce("test.doc");

        await extension.open(node);

        expect(existsSync.mock.calls.length).toBe(1);
        expect(existsSync.mock.calls[0][0]).toBe(path.join(extension.BRIGHTTEMPFOLDER, "/" + node.getSessionNode().mLabel + "/", node.pattern));
        expect(ussFile.mock.calls.length).toBe(1);
        expect(ussFile.mock.calls[0][0]).toBe(session);
        expect(ussFile.mock.calls[0][1]).toBe(node.pattern);
        expect(ussFile.mock.calls[0][2]).toEqual({ file: extension.getDocumentFilePath(node) });
        expect(openTextDocument.mock.calls.length).toBe(1);
        expect(openTextDocument.mock.calls[0][0]).toBe(extension.getDocumentFilePath(node));
        expect(showTextDocument.mock.calls.length).toBe(1);
        expect(showTextDocument.mock.calls[0][0]).toBe("test.doc");

        openTextDocument.mockResolvedValueOnce("test.doc");
        const node2 = new ZoweNode("sestest", vscode.TreeItemCollapsibleState.None, sessNode, null, null);

        await extension.open(node2);

        ussFile.mockReset();
        openTextDocument.mockReset();
        showTextDocument.mockReset();
        existsSync.mockReset();

        existsSync.mockReturnValue("exists");
        showTextDocument.mockRejectedValueOnce(Error("testError"));

        try {
            await extension.open(child);
        } catch (err) {
            // do nothing
        }

        expect(ussFile.mock.calls.length).toBe(0);
        expect(openTextDocument.mock.calls.length).toBe(1);
        expect(openTextDocument.mock.calls[0][0]).toBe(extension.getDocumentFilePath(node));
        expect(showTextDocument.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls.length).toBe(1);
        expect(showErrorMessage.mock.calls[0][0]).toBe("testError");

        const child2 = new ZoweNode("child", vscode.TreeItemCollapsibleState.None, node2, null, null);
        try {
            await extension.open(child2);
        } catch (err) {
            // do nothing
        }

        ussFile.mockReset();
        openTextDocument.mockReset();
        showTextDocument.mockReset();
        existsSync.mockReset();
        showErrorMessage.mockReset();

        const badparent = new ZoweNode("parent", vscode.TreeItemCollapsibleState.Collapsed, sessNode, null, null);
        badparent.contextValue = "turnip";
        const brat = new ZoweNode("brat", vscode.TreeItemCollapsibleState.None, badparent, null, null);
        try {
            await extension.open(brat);
        } catch (err) {
        }
        expect(ussFile.mock.calls.length).toBe(0);
        expect(showErrorMessage.mock.calls.length).toBe(2);
        expect(showErrorMessage.mock.calls[0][0]).toBe("open() called from invalid node.");
        expect(showErrorMessage.mock.calls[1][0]).toBe("open() called from invalid node.");
    });

});
