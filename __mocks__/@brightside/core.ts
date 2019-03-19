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

import { Session } from "../Session";
import { IListOptions } from "@brightside/core";
import * as imperative from "../@brightside/imperative";

// tslint:disable-next-line:no-namespace
export namespace ZosmfSession {
    export function createBasicZosmfSession(profile: imperative.Profile){
        return true;
    }
}

export declare const enum samplecreateFileTypeEnum {
    DATA_SET_BINARY = 0,
    DATA_SET_C = 1,
    DATA_SET_CLASSIC = 2,
    DATA_SET_PARTITIONED = 3,
    DATA_SET_SEQUENTIAL = 4,
}

// tslint:disable-next-line:no-namespace
export namespace List {
    export function fileList(session: Session, path: string, options: {}): Promise<IZosFilesResponse> {
        if(path === "Throw Error") {
            throw Error("Throwing an error to check error handling for unit tests!");
        }

        return new Promise((resolve) => {
            if(path === "Response Fail") {
                resolve({ success: false });
                return;
            }
            const response = {
                success: true,
                apiResponse: {
                    items: [
                        {
                            name: "aDir", mode: "drwxrwxrwx", size: 888, uid: 0, user: "ADMIN", gid: 1,
                            group: "OMVSGRP", mtime: "2015-11-24T02:12:04"
                        },
                        {
                            name: "myFile.txt", mode: "-rw-r--r--", size: 20, uid: 0, user: "ADMIN", gid: 1,
                            group: "OMVSGRP", mtime: "2013-05-07T11:23:08"
                        }
                ],  returnedRows: 2, totalRows: 2, JSONversion: 1
                }
            };
            resolve(response);
        });
    }

}

// tslint:disable-next-line:max-classes-per-file
export class IZosFilesResponse {
    /**
     * indicates if the command ran successfully.
     * @type {boolean}
     */
    public success: boolean;
    /**
     * The command response text.
     * @type{string}
     */
    public commandResponse?: string;
    /**
     * The api response object.
     * @type{*}
     */
    public apiResponse?: any;
}
