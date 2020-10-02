import Axios, { AxiosResponse } from 'axios';
import { DRIVE } from '../constants';
import { DriveDirectory } from '../interfaces';

abstract class API {
    abstract drive: DRIVE;
    abstract fetchSubDirectories(token: string, directoryID: string, nextpageToken?: string): Promise<DriveDirectory[]>;

    public getAndStoreToken(code: string){
        Axios.get(`http://localhost:8080/token/get/${this.drive.toLowerCase()}/${code}`)
            .then((res: AxiosResponse) => {
                localStorage.setItem(`${this.drive.toLowerCase()}_token`, JSON.stringify(res.data));
                window.location.href = window.origin;
            })
      }
}

export default API;