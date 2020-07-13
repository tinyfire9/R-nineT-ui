import { DriveDirectory } from '../../interfaces';
import { DIRECTORY_TYPE } from '../../constants';

class API {
    private uri = 'https://graph.microsoft.com/v1.0';

    public fetchSubDirectories(token: string, dir_id:string = 'root') {
        let uri = `${this.uri}/me/drive/items/${dir_id}/children`;
        return new Promise((resolve: any, reject: any) => {
            fetch(uri, {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            })
                .then((res: Response) => res.json())
                .then((data: any) => {
                    if(data.error) {
                        reject(data.error.message);
                        return;
                    }

                    let dirs: DriveDirectory[] = data.value.map((dir: any) => ({
                        id: dir.id,
                        name: dir.name,
                        type: dir.file ? DIRECTORY_TYPE.FILE : DIRECTORY_TYPE.DIRECTORY
                    }));

                    resolve(dirs);
                })
                .catch((err: Error) => reject(err.message))
        });
    }
}

export default API;