import { DriveConfig, AUTH_TYPE } from "../interfaces";
import { DRIVE } from "../../../../constants";
import OneDriveAPI from "./api";

let config: DriveConfig = {
    name: DRIVE.ONE_DRIVE,
    displayName: 'One Drive',
    auth: {
        type: AUTH_TYPE.CODE,
        clientID: '12f99e3f-599e-47ce-b76f-966d36fbe5d5',
        authorizationUri: 'https://login.microsoftonline.com/057d7361-5092-4f97-84d0-7f7d699e7cbe/oauth2/v2.0/authorize',
        scopes: ['Files.ReadWrite.All'],
        redirectUri: "https://localhost:3000",
    },
    dirSelector: {
        rootDirectoryID: 'root',
        api: new OneDriveAPI()
    }
};

export { config };