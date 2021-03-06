import Axios, { AxiosResponse } from 'axios';
import { DRIVE } from '../../../constants';
import { DriveDirectory } from '../../../interfaces';

abstract class API {
    abstract drive: DRIVE;
    protected nextpageToken: string = '';
    protected prevQueryDirectoryID: string = '';

    abstract fetchSubDirectories(token: string, directoryID: string, nextpageToken?: string): Promise<DriveDirectory[]>;
    abstract fetchNextPage(token: string, directoryID: string): Promise<DriveDirectory[]>;

    public getAndStoreToken(code: string){
        Axios.get(`http://localhost:8080/token/get/${this.drive.toLowerCase()}/${code}`)
            .then((res: AxiosResponse) => {
                this.storeToken(res.data);
            });
    }

    public storeToken(data: any) {
        localStorage.setItem(`${this.drive.toLowerCase()}_token`, JSON.stringify(data));
        window.location.href = window.origin;
    }

    public logout = () => {
        localStorage.setItem(`${this.drive.toLowerCase()}_token`, '');
        window.location.href = window.origin;
    }
}

export default API;