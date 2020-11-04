import { DriveConfig, AUTH_TYPE } from "../interfaces";
import { DRIVE } from "../../../../constants";
import { BoxAPI } from "./api";

let config: DriveConfig = {
    name: DRIVE.BOX,
    displayName: 'Box',
    auth: {
        type: AUTH_TYPE.CODE,
        clientID: 'inothb10fvq4yopnj2bzhh9khnawl4f5',
        authorizationUri: 'https://account.box.com/api/oauth2/authorize',
        redirectUri: window.location.origin + "?auth-drive=box", 
    },
    dirSelector: {
        api: new BoxAPI(),
        rootDirectoryID: '0'
    }
};

export { config };