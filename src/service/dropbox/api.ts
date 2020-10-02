import API from "../api";
import { DRIVE } from "../../constants";
import { DriveDirectory } from "../../interfaces";

class DropboxAPI extends API {
    drive:DRIVE = DRIVE.DROPBOX;

    public fetchSubDirectories(token: string, directoryID: string): Promise<DriveDirectory[]>{
        return new Promise((resolve, reject) => {});
    }
}

export default DropboxAPI;