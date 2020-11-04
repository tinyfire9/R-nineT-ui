import { DriveConfig, AUTH_TYPE } from "../interfaces";
import { DRIVE } from "../../../../constants";
import GoogleDriveAPI from "./api";

let config: DriveConfig = {
    name: DRIVE.GOOGLE_DRIVE,
    displayName: 'Google Drive',
    auth: {
        type: AUTH_TYPE.TOKEN,
        clientID: '719295962986-hhjcql786up8ifdho3pgd4mi73f4l92v.apps.googleusercontent.com',
        scopes: ["https://www.googleapis.com/auth/drive"],
        authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
        redirectUri: window.origin + '?auth-drive=google_drive',
    },
    dirSelector: {
        rootDirectoryID: 'root',
        api: new GoogleDriveAPI()
    }
};

export { config };