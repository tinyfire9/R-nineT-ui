import { DIRECTORY_TYPE, DRIVE } from '../../constants';
import { DriveDirectory } from '../../interfaces';
import API from '../api';

interface GDriveResponse {
    nextPageToken: string;
    items: DriveDirectory[];
}

class GDriveAPI extends API{
    drive: DRIVE = DRIVE.GOOGLE_DRIVE;
    private uri = "https://www.googleapis.com/drive/v3/files";
    public fetchSubDirectories(token: string, directory_id?: string, nextPageToken?: string): Promise<DriveDirectory[]> {
        let uri = this.uri + '?fields=*&access_token=' + token;

        if(directory_id){
            uri  +=  '&q=\'' + directory_id + '\'+in+parents'
        }

        if(nextPageToken) {
            uri += '&pageToken=' + nextPageToken;
        }

        return new Promise((resolve: any, reject: any) => {
            fetch(uri)
                .then((res: Response) => res.json())
                .then((res: any) => {
                    if(res.error) {
                        reject(res.error.message);
                        return;
                    }
                    let subDir: DriveDirectory[] = res.files.map(({ name, id, mimeType }: any) => ({
                        name,
                        id,
                        type: mimeType.includes('folder') ? DIRECTORY_TYPE.DIRECTORY : DIRECTORY_TYPE.FILE,
                    }));

                    resolve(subDir);
                }, (error: any) => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

export default GDriveAPI;