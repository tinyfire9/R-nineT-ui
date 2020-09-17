import React from 'react';
import { DriveDirectory } from '../../interfaces';
import { DIRECTORY_TYPE } from '../../constants';

export class BoxAPI {
    public fetchSubDirectories(token: string, directoryID: string){
        let uri = `https://api.box.com/2.0/folders/${directoryID}/items`;

        let headers = new Headers();
        headers.set('Authorization', 'Bearer ' + token);
        headers.set("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            fetch(uri, { headers })
                .then((res: Response) => res.json())
                .then((res: any) => {
                    console.log(res)
                    let directories: DriveDirectory[] = res.entries.map(({ type, id, name }: any) => ({
                        name,
                        id,
                        type: type == 'file' ? DIRECTORY_TYPE.FILE : DIRECTORY_TYPE.DIRECTORY
                    }));
    
                    resolve(directories);
                })
                .catch((error: Error) => {
                    reject(error.message)
                });
            
        })
    }
}