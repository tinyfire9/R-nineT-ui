import React from 'react';
import { DriveState, AuthData, TransferSession, Drives, WINDOW } from './interfaces';
import { DRIVE } from '../constants';
import DrivesDropdown from '../lib/drives-dropdown';
import DriveWindow from '../lib/drive-window';
import axios from 'axios';
import DropboxAPI from '../service/dropbox/api';

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

        this.state = {
            leftWindowDrive: DRIVE.UNDEFINED,
            rightWindowDrive: DRIVE.UNDEFINED,
            drives: this.initDrivesState(),
            transfer_sessions: []
        }
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

        this.setState(newState);
    }

    public render() {
        let { leftWindowDrive, rightWindowDrive, drives  } = this.state;

        return(
            <div className="r-ninet-drives">
                <div className="r-ninet-left-drive">
                    <DrivesDropdown
                        window={WINDOW.LEFT}
                        leftWindowDrive={this.state.leftWindowDrive}
                        rightWindowDrive={this.state.rightWindowDrive}
                        drives={this.state.drives}
                        onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.LEFT)}
                    />
                    <br />
                    {
                        leftWindowDrive !== DRIVE.UNDEFINED ?
                            <DriveWindow
                                drive={leftWindowDrive}
                                token={drives[leftWindowDrive].authData.token}
                                currentDirectoryID={drives[leftWindowDrive].currentDirectoryID}
                                onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                                onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                            /> : 
                            ''
                    }
                </div>
                <div className="r-ninet-right-drive">
                    <DrivesDropdown
                        window={WINDOW.RIGHT}
                        leftWindowDrive={this.state.leftWindowDrive}
                        rightWindowDrive={this.state.rightWindowDrive}
                        drives={this.state.drives}
                        onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.RIGHT)}
                    />
                    <br />
                    {
                        rightWindowDrive !== DRIVE.UNDEFINED ? 
                            <DriveWindow
                                drive={rightWindowDrive}
                                token={drives[rightWindowDrive].authData.token}
                                currentDirectoryID={drives[rightWindowDrive].currentDirectoryID}
                                onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                                onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                            /> :
                            ''

                    }
                </div>
            </div>
        )
    }
}

export default App;