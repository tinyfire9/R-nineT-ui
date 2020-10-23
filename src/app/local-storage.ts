import { AuthData } from "./interfaces";
import { DRIVE } from "../constants";
import { TransferViewState } from "./transfer/transfer";

export default class LocalStorageServices {
    public saveWindowStateOnLocalStorage(state: TransferViewState) {
        localStorage.setItem('r-ninet-window-state', JSON.stringify({
            leftWindowDrive: state.leftWindowDrive,
            rightWindowDrive: state.rightWindowDrive
        }));
    }

    public getWindowStateFromLocalStorage() {
        let windowStateStr = localStorage.getItem('r-ninet-window-state') || '{}';
        if(windowStateStr === '{}'){
            return {
                leftWindowDrive: DRIVE.UNDEFINED,
                rightWindowDrive: DRIVE.UNDEFINED
            }
        }

        let windowState = JSON.parse(windowStateStr);
        return {
            leftWindowDrive: windowState.leftWindowDrive,
            rightWindowDrive: windowState.rightWindowDrive
        };
    }

    public getAuthDataFromLocalStorage(drive: string): AuthData{
        let authData: AuthData = {
            accessToken: '',
            refreshToken: '',
            tokenType: '',
            expiresIn: -1,
            expiresAt: -1,
        };

        let data: any = JSON.parse(localStorage.getItem(`${drive}_token`) || '{}');
        if(!data || data === null){
            return authData;
        }

        if(new Date().getTime() + 1000000 > data['expiresAt'] && data['expiresAt'] != -1) {
            localStorage.removeItem(`${drive}_token`);
            return authData;
        }

        authData.accessToken = data['accessToken'];
        authData.refreshToken = data['refreshToken'];
        authData.tokenType = data['tokenType'];
        authData.expiresIn = data['expiresIn'];
        authData.expiresAt = data['expiresAt'];

        return authData;
    }

    public isTokenStoredInLocalStorage(drive: DRIVE){
        let tokenObjectStr = localStorage.getItem(`${drive.toLowerCase()}_token`);
        if(tokenObjectStr === '' || tokenObjectStr === '{}' || tokenObjectStr === null){
            return false;
        }

        let tokenObject = JSON.parse(tokenObjectStr);
        if(tokenObject.accessToken === null || tokenObject.accessToken === ''){
            return false;
        }

        return true;
    }

}