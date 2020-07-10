import React from 'react';
import { DRIVE_COMPONENTS } from '../drive-components';
import { StoreState, DriveState, AuthData, TransferSession } from './interfaces';
import { DRIVE } from '../constants';

interface TransferData {
    selectedItems?: any;
    currentDirectory?: any;
}

interface DrivePayload {
    authData: AuthData;
    transferData: TransferData;
}

interface TransferRequestPayload {
    src: DrivePayload;
    dest: DrivePayload
}

interface AppState {
    left_window_drive: DRIVE | null,
    right_window_drive: DRIVE | null,
    drives: { [drive: string]: DriveState },
    transfer_sessions: TransferSession[]
}

class App extends React.Component <any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            left_window_drive: DRIVE.GOOGLE_DRIVE, 
            right_window_drive: DRIVE.ONE_DRIVE,
            drives: this.initDrivesState(),
            transfer_sessions: []
        }
    }

    private initDrivesState() {
        let drives: any = {};
        for( let drive in DRIVE) {
            drives[drive.toLocaleLowerCase()] = {
                drive: drive as DRIVE,
                authData: {} as any,
                current_directory: {} as any,
            }
        }

        return drives;
    }

    private onAuthSuccess(drive: DRIVE, authData: any) {
        let newState: AppState = {...this.state};
        
        let { authData: _authData } = newState.drives[drive];
        newState.drives[drive].authData = { ..._authData, ...authData };

        this.setState(newState);
    }

    private getSrcAndDestDrives(src_drive: DRIVE): { src: DriveState, dest: DriveState | null } {
        let { drives, left_window_drive, right_window_drive } = this.state;
        
        return (src_drive == left_window_drive) ? ({
            src: drives[src_drive],
            dest: right_window_drive ? drives[right_window_drive] : null,
        }) : 
        ({
            src: drives[src_drive],
            dest: left_window_drive ? drives[left_window_drive] : null,
        });
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
                authData: src.authData,
                transferData: {
                    selectedItems,
                }
            },
            dest: {
                authData: dest.authData,
                transferData: {
                    currentDirectory: dest.current_directory,
                }
            }
        };

        console.log({ payload });
    }


    public render() {
        let GDriveAuth = DRIVE_COMPONENTS[DRIVE.GOOGLE_DRIVE].authComponent;
        let GDrive = DRIVE_COMPONENTS[DRIVE.GOOGLE_DRIVE].dirSelectorComponent;

        return(
            <React.Fragment>
                <GDriveAuth onAuthSuccess={(drive: DRIVE, authData: AuthData) => this.onAuthSuccess(drive, authData)}/>
                {
                    this.state.drives[DRIVE.GOOGLE_DRIVE].authData.token ? 
                        <GDrive
                            token={this.state.drives[DRIVE.GOOGLE_DRIVE].authData.token}
                            onTransferRequest={
                                (srcDrive: DRIVE, selectedItems: any) => this.onTransferRequest(srcDrive, selectedItems)
                            }
                        />: ''
                }
            </React.Fragment>
        )
    }
}

export default App;