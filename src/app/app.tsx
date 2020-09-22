import React from 'react';
import { DriveState, AuthData, TransferSession, Drives, WINDOW } from './interfaces';
import { DRIVE } from '../constants';
import DrivesDropdown from '../lib/drives-dropdown';
import DriveWindow from '../lib/drive-window';
import axios from 'axios';

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
            leftWindowDrive: DRIVE.GOOGLE_DRIVE,
            rightWindowDrive: DRIVE.BOX,
            drives: this.initDrivesState(),
            transfer_sessions: []
        }
    }

    private initDrivesState() {
        let drives: any = {};
        for( let drive in DRIVE) {
            drives[drive.toLocaleLowerCase()] = {
                drive: drive.toLowerCase(),
                authData: {} as any,
                currentDirectoryID: drive == DRIVE.BOX ? '0' : 'root',
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
        console.log({
            drives: JSON.stringify(this.state)
        })

        return(
            <React.Fragment>
                <DrivesDropdown
                    window={WINDOW.LEFT}
                    leftWindowDrive={this.state.leftWindowDrive}
                    rightWindowDrive={this.state.rightWindowDrive}
                    drives={this.state.drives}
                    onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.LEFT)}
                />
                <br />
                <DriveWindow
                    drive={leftWindowDrive}
                    token={drives[leftWindowDrive].authData.token}
                    currentDirectoryID={drives[leftWindowDrive].currentDirectoryID}
                    onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                    onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                    onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                />
                <DrivesDropdown
                    window={WINDOW.RIGHT}
                    leftWindowDrive={this.state.leftWindowDrive}
                    rightWindowDrive={this.state.rightWindowDrive}
                    drives={this.state.drives}
                    onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, WINDOW.RIGHT)}
                />
                <br />
                <DriveWindow
                    drive={rightWindowDrive}
                    token={drives[rightWindowDrive].authData.token}
                    currentDirectoryID={drives[rightWindowDrive].currentDirectoryID}
                    onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                    onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                    onTransferRequest={(drive: DRIVE, selectedItems: any) => this.onTransferRequest(drive, selectedItems )}
                />
            </React.Fragment>
        )
    }
}

export default App;