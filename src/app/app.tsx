import React from 'react';
import { DriveState, AuthData, TransferSession, Drives, WINDOW } from './interfaces';
import { DRIVE } from '../constants';
import DrivesDropdown from '../lib/drives-dropdown';
import DriveWindow from '../lib/drive-window';
import axios from 'axios';
import DropboxAPI from '../service/dropbox/api';
import { Card, Button, Tooltip, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

interface TransferData {
    selectedItems?: any;
    uploadDirectoryID?: string;
}

interface DrivePayload {
    drive: DRIVE;
    authData: AuthData;
    transferData: TransferData;
}

interface TransferRequestPayload {
    src: DrivePayload;
    dest: DrivePayload
}

interface AppState {
    leftWindowDrive: DRIVE;
    rightWindowDrive: DRIVE;
    drives: Drives,
    transfer_sessions: TransferSession[]
}

class App extends React.Component <any, AppState> {
    constructor(props: any) {
        super(props);

        let { leftWindowDrive, rightWindowDrive } = this.getWindowStateFromLocalStorage();

        this.state = {
            leftWindowDrive,
            rightWindowDrive,
            drives: this.initDrivesState(),
            transfer_sessions: []
        }
    }

    private saveWindowStateOnLocalStorage(state: AppState) {
        localStorage.setItem('r-ninet-window-state', JSON.stringify({
            leftWindowDrive: state.leftWindowDrive,
            rightWindowDrive: state.rightWindowDrive
        }));
    }

    private getWindowStateFromLocalStorage() {
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

    private getAuthDataFromLocalStorage(drive: string): AuthData{
        let authData: AuthData = {
            token: '',
            name: '',
            email: '',
            image_url: '',
            expiration_time: 0,
        };

        let data: any = JSON.parse(localStorage.getItem(`${drive}_TOKEN`.toLocaleLowerCase()) || '{}');
        if(!data || data === null){
            return authData;
        }

        authData.token = data['accessToken'];
        authData.name = data['name'];
        authData.email = data['email'];
        authData.image_url = data['imageURL'];
        authData.expiration_time = data['expirationTime'];

        return authData;
    }

    private initDrivesState() {
        let drives: any = {};
        let rootDirectoryID = {
            [`${DRIVE.GOOGLE_DRIVE}`]: 'root',
            [`${DRIVE.ONE_DRIVE}`]: 'root',
            [`${DRIVE.BOX}`]: '0',
            [`${DRIVE.DROPBOX}`]: '',
        }
        for( let drive in DRIVE) {
            drives[drive.toLocaleLowerCase()] = {
                drive: drive.toLowerCase(),
                authData: this.getAuthDataFromLocalStorage(drive),
                currentDirectoryID: rootDirectoryID[drive],
            }
        }

        return drives;
    }

    private onAuthSuccess(drive: DRIVE, authData: AuthData) {
        let newState: AppState = {...this.state};
        
        let { authData: _authData } = newState.drives[drive];
        newState.drives[drive].authData = { ..._authData, ...authData };

        this.setState(newState);
    }

    private getSrcAndDestDrives(src_drive: DRIVE): { src: DriveState, dest: DriveState | null } {
        let { drives, leftWindowDrive, rightWindowDrive } = this.state;
        
        return (src_drive == leftWindowDrive) ? ({
            src: drives[src_drive],
            dest: rightWindowDrive ? drives[rightWindowDrive] : null,
        }) : 
        ({
            src: drives[src_drive],
            dest: leftWindowDrive ? drives[leftWindowDrive] : null,
        });
    }

    private onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string) {
        let newState = { ...this.state };

        newState.drives[drive].currentDirectoryID = newID;

        this.setState(newState);
    }

    private onTransferRequest(src_drive: DRIVE, selectedItems: any) {
        let { src, dest } = this.getSrcAndDestDrives(src_drive);

        if(!dest) {
            console.log("Please select a destination drive");
            return;
        }

        if(!dest.authData.token) {
            console.log("Please login to " + dest.drive);
            return;
        }

        if(dest.authData.expiration_time <= new Date().getTime()) {
            console.log("Plese login to " + dest.drive + " again ");
            return;
        }

        let payload: TransferRequestPayload = {
            src: {
                drive: src.drive,
                authData: src.authData,
                transferData: {
                    selectedItems,
                }
            },
            dest: {
                drive: dest.drive,
                authData: dest.authData,
                transferData: {
                    uploadDirectoryID: this.state.drives[dest.drive].currentDirectoryID
                }
            }
        };

        let headers = new Headers();
        headers.set('Content-Type', 'application/json');

        axios({
            url: "http://localhost:8080/transfer",
            method: 'post',
            data: payload,
            headers,
        })
        .then(res => console.log(res.data));
    }

    private onDriveSelect(drive: DRIVE, window: WINDOW) {
        let newState: AppState = { ...this.state };

        if(window == WINDOW.LEFT) {
            newState.leftWindowDrive = drive;
        } else if( window == WINDOW.RIGHT) {
            newState.rightWindowDrive = drive;
        }

        this.saveWindowStateOnLocalStorage(newState);
        this.setState(newState);
    }

    private onLogout(drive: DRIVE) {
        localStorage.setItem(`${drive.toLowerCase()}_token`, '');
        window.location.href = window.origin;
    }

    private isLoggedIn(drive: DRIVE){
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

    public render() {
        let { leftWindowDrive, rightWindowDrive, drives  } = this.state;

        return(
            <div className="r-ninet-drives" >
                <Card className="r-ninet-left-drive" style={{overflow: 'auto', minHeight: window.innerHeight*.65}}>
                    <div className="r-ninet-left-drive-menu-bar">
                        {
                            this.isLoggedIn(leftWindowDrive) ?
                                <Button className="r-ninet-drive-button-logout" intent={Intent.DANGER} onClick={() => this.onLogout(leftWindowDrive)}>
                                    <Tooltip content="Logout">
                                        <Icon icon={IconNames.LOG_OUT}/>
                                    </Tooltip>
                                </Button>:
                                ''
                        }
                        <DrivesDropdown
                            window={WINDOW.LEFT}
                            leftWindowDrive={this.state.leftWindowDrive}
                            rightWindowDrive={this.state.rightWindowDrive}
                            drives={this.state.drives}
                            onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.LEFT)}
                        />
                    </div>
                    {
                        leftWindowDrive !== DRIVE.UNDEFINED ?
                            <DriveWindow
                                window={WINDOW.LEFT}
                                drive={leftWindowDrive}
                                token={drives[leftWindowDrive].authData.token}
                                currentDirectoryID={drives[leftWindowDrive].currentDirectoryID}
                                onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                                onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                            /> : 
                            ''
                    }
                </Card>
                <Card className="r-ninet-right-drive" style={{overflow: 'auto', minHeight: window.innerHeight*.85}}>
                    <div className="r-ninet-left-drive-menu-bar">
                        {
                            this.isLoggedIn(rightWindowDrive) ? 
                                <Button className="r-ninet-drive-button-logout" intent={Intent.DANGER} onClick={() => this.onLogout(rightWindowDrive)}>
                                    <Tooltip content="Logout">
                                        <Icon icon={IconNames.LOG_OUT}/>
                                    </Tooltip>
                                </Button>: 
                                ''
                        }
                        <DrivesDropdown
                            window={WINDOW.RIGHT}
                            leftWindowDrive={this.state.leftWindowDrive}
                            rightWindowDrive={this.state.rightWindowDrive}
                            drives={this.state.drives}
                            onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.RIGHT)}
                        />
                    </div>
                    {
                        rightWindowDrive !== DRIVE.UNDEFINED ? 
                            <DriveWindow
                                window={WINDOW.RIGHT}
                                drive={rightWindowDrive}
                                token={drives[rightWindowDrive].authData.token}
                                currentDirectoryID={drives[rightWindowDrive].currentDirectoryID}
                                onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                                onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                            /> :
                            ''

                    }
                </Card>
            </div>
        )
    }
}

export default App;