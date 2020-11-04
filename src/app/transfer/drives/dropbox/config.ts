import { DriveConfig, AUTH_TYPE } from "../interfaces";
import DropboxAPI from "./api";
import { DRIVE } from "../../../../constants";

let config: DriveConfig = {
    name: DRIVE.DROPBOX,
    displayName: 'Dropbox',
    auth: {
        type: AUTH_TYPE.CODE,
        clientID:'gyk9ex16zbrt706',
        authorizationUri: 'https://www.dropbox.com/oauth2/authorize',
        redirectUri: window.origin + '?auth-drive=dropbox'
    },
    dirSelector: {
        rootDirectoryID: '',
        api: new DropboxAPI(),
    }
};

export { config };