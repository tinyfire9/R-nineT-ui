import { API } from '../interfces';
import { GDriveDirectory } from '../../interfaces';

interface GDriveResponse {
    nextPageToken: string;
    items: GDriveDirectory[];
}

class GDriveAPI {
    private uri = "https://www.googleapis.com/drive/v3/files";
    public fetchSubDirectory(token: string, directory_id?: string, nextPageToken?: string) {
        let uri = this.uri + '?access_token=' + token;
        if(directory_id){
            uri  +=  '&q=\'' + directory_id + '\'+in+parents'
        }

        return new Promise((resolve: any, reject: any) => {
            fetch(uri)
                .then((res: Response) => res.json())
                .then((res: any) => {
                    if(res.error) {
                        reject(res.error.message);
                        return;
                    }
                    let subDir: GDriveDirectory[] = res.files.map(({ name, id, mimeType }: any) => ({
                        name,
                        id,
                        type: mimeType.includes('folder') ? 'Directory' : 'File',
                    }));

                    resolve({ nextPageToken: res.nextPageToken, files: subDir });
                }, (error: any) => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

export default GDriveAPI;