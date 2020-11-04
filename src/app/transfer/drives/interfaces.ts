import { DRIVE } from "../../../constants";
import API from "./api";

export enum AUTH_TYPE {
    CODE = 'code',
    TOKEN = 'token'
}

export interface DriveConfig {
    name: DRIVE;
    displayName: string;
    auth: {
        type: AUTH_TYPE;
        clientID: string;
        authorizationUri: string;
        redirectUri?: string;
        scopes?: string[];
    },
    dirSelector: {
        rootDirectoryID: string;
        api: API;
    }
}