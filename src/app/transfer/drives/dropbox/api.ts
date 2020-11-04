import API from "../api";
import { DRIVE, DIRECTORY_TYPE } from "../../../../constants";
import { DriveDirectory } from "../../../../interfaces";
import Axios, { AxiosResponse, AxiosError } from "axios";

class DropboxAPI extends API {
    drive:DRIVE = DRIVE.DROPBOX;

    public fetchSubDirectories(token: string, directoryID: string, nextPageToken?: string): Promise<DriveDirectory[]>{
        return new Promise((resolve, reject) => {
            let url = "https://api.dropboxapi.com/2/files/list_folder";

            Axios.post(url, {
                path: directoryID
            }, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then((res: AxiosResponse) => {
                let data: DriveDirectory[] = res.data.entries.map((entry: any) => {
                    return {
                        name: entry['name'],
                        id: entry['path_lower'],
                        type: (entry['.tag'] === 'folder') ? DIRECTORY_TYPE.DIRECTORY : DIRECTORY_TYPE.FILE,
                    }
                });
                resolve(data);
            })
            .catch((err: AxiosError) => {
                console.log(err);
                reject([]);
            });
        });
    }

    public fetchNextPage (token: string, directoryID: string): Promise<DriveDirectory[]>{
        return new Promise((resolve, reject) => {
            resolve([]);
        })
      }
}

export default DropboxAPI;