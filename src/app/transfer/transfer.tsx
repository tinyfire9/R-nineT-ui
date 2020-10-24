import React from 'react';
import axios from 'axios';
import { IconNames, IconName } from '@blueprintjs/icons';
import { Card, Button, Tooltip, Icon, Intent } from '@blueprintjs/core';

import { DriveState, AuthData, TransferSession, Drives, WINDOW } from './../interfaces';
import { DRIVE } from '../../constants';
import DrivesDropdown from '../../lib/drives-dropdown';
import DriveWindow from '../../lib/drive-window';
import LocalStorageServices from '../local-storage';

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

export interface TransferViewState {
    leftWindowDrive: DRIVE;
    rightWindowDrive: DRIVE;
    drives: Drives,
    transfer_sessions: TransferSession[]
}

class TransferView extends React.Component <any, TransferViewState> {
    private localStorageServices: LocalStorageServices = new LocalStorageServices();
    constructor(props: any) {
        super(props);

        let { leftWindowDrive, rightWindowDrive } = this.localStorageServices.getWindowStateFromLocalStorage();

        this.state = {
            leftWindowDrive,
            rightWindowDrive,
            drives: this.initDrivesState(),
            transfer_sessions: []
        }
    }

    private initDrivesState() {
        let drives: any = {};
        let rootDirectoryID = {
            [`${DRIVE.GOOGLE_DRIVE}`]: 'root',
            [`${DRIVE.ONE_DRIVE}`]: 'root',
            [`${DRIVE.BOX}`]: '0',
            [`${DRIVE.DROPBOX}`]: '',
        }
        for( let driveItem in DRIVE) {
            let drive = driveItem.toLowerCase();
            drives[drive] = {
                drive,
                authData: this.localStorageServices.getAuthDataFromLocalStorage(drive),
                currentDirectoryID: rootDirectoryID[drive],
                selectedItems: []
            }
        }

        return drives;
    }

    private onAuthSuccess(drive: DRIVE, authData: AuthData) {
        let newState: TransferViewState = {...this.state};
        
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
            return;
        }

        if(!dest.authData.accessToken) {
            return;
        }

        if(dest.authData.expiresAt > new Date().getTime()) {
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
        let newState: TransferViewState = { ...this.state };

        if(window == WINDOW.LEFT) {
            newState.leftWindowDrive = drive;
        } else if( window == WINDOW.RIGHT) {
            newState.rightWindowDrive = drive;
        }

        this.localStorageServices.saveWindowStateOnLocalStorage(newState);
        this.setState(newState);
    }

    private onLogout(drive: DRIVE) {
        localStorage.setItem(`${drive.toLowerCase()}_token`, '');
        window.location.href = window.origin;
    }

    private isLoggedIn(drive: DRIVE){
        return this.localStorageServices.isTokenStoredInLocalStorage(drive);
    }

    private onSelectedItemsUpdate(drive: DRIVE, selectedItems: string[]){
        let newState: TransferViewState = { ...this.state};
        newState.drives[drive.toLowerCase()].selectedItems = selectedItems;
        this.setState(newState);
    }

    private createTransferButton(driveWindow: WINDOW) {
        const { drives, leftWindowDrive, rightWindowDrive } = this.state;
        let icon:IconName = driveWindow === WINDOW.LEFT ? IconNames.CIRCLE_ARROW_RIGHT : IconNames.CIRCLE_ARROW_LEFT;
        let drive = driveWindow === WINDOW.LEFT ? leftWindowDrive : rightWindowDrive;
        let selectedItems = drives[drive.toLowerCase()].selectedItems;
        let shouldDisableButton = selectedItems.length === 0 || !this.isLoggedIn(leftWindowDrive) || !this.isLoggedIn(rightWindowDrive);

        let makeButton = () => ( 
            <Button
                disabled={shouldDisableButton}
                className={`r-ninet-${driveWindow.toLowerCase()}-drive-transfer-button`}
                onClick={() => this.onTransferRequest(drive, selectedItems)}
            >
                <Icon icon={icon} intent={Intent.PRIMARY} iconSize={20}/>
            </Button>
        );

        return (!shouldDisableButton && selectedItems.length > 0 ?
            <Tooltip
                content={`Transfer ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`}
            >
                {makeButton()}
            </Tooltip> :
            makeButton()
        );
    }

    private createDriveWindow(driveWindow: WINDOW) {
        let { leftWindowDrive, rightWindowDrive, drives  } = this.state;

        let driveOnWindow = driveWindow == WINDOW.LEFT ? leftWindowDrive : rightWindowDrive;
        let height = window.innerHeight*.85;
        let cardStyle = {
            overflow: 'auto',
            minHeight: height,
            maxHeight: height
        }

        return (
            <Card className={`r-ninet-${driveWindow.toLowerCase()}-drive`} style={cardStyle}>
                <div className={`r-ninet-${driveWindow.toLowerCase()}-drive-menu-bar`}>
                    {
                        this.isLoggedIn(driveOnWindow) ?
                            <Button className="r-ninet-drive-button-logout" intent={Intent.DANGER} onClick={() => this.onLogout(driveOnWindow)}>
                                <Tooltip content="Logout">
                                    <Icon icon={IconNames.LOG_OUT}/>
                                </Tooltip>
                            </Button>:
                            ''
                    }
                    <DrivesDropdown
                        window={driveWindow}
                        leftWindowDrive={this.state.leftWindowDrive}
                        rightWindowDrive={this.state.rightWindowDrive}
                        drives={this.state.drives}
                        onDriveSelect={(drive: DRIVE) => this.onDriveSelect(drive, driveWindow)}
                    />
                </div>
                <br />
                <br />
                {
                    driveOnWindow !== DRIVE.UNDEFINED ?
                        <DriveWindow
                            window={driveWindow}
                            drive={driveOnWindow}
                            token={drives[driveOnWindow].authData.accessToken}
                            currentDirectoryID={drives[driveOnWindow].currentDirectoryID}
                            onAuthSuccess={(drive: DRIVE, authData: any) => this.onAuthSuccess(drive, authData)}
                            onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.onCurrentDirectoryIDUpdate(drive, newID)}
                            onSelectedItemsUpdate={(drive: DRIVE, selectedItems: any) => this.onSelectedItemsUpdate(drive, selectedItems )}
                        /> : 
                        ''
                }
            </Card>
        );
    }

    public render() {
        return(
            <div className="r-ninet-drives" >
                {this.createDriveWindow(WINDOW.LEFT)}
                <div className="r-ninet-drives-transfer-buttons" style={{marginTop: window.innerHeight * .40}}>
                    {this.createTransferButton(WINDOW.LEFT)}
                    {this.createTransferButton(WINDOW.RIGHT)}
                </div>
                {this.createDriveWindow(WINDOW.RIGHT)}
            </div>
        )
    }
}

export default TransferView;