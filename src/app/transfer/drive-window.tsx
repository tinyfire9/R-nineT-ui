import React, { Component } from 'react';

import { config } from './drives';
import { DriveConfig } from './drives/interfaces';
import API from './drives/api';

import { DRIVE } from '../../constants'
import { AuthData, WINDOW } from '../../app/interfaces';
import Drive from '../../lib/drive';
import Login from '../../lib/login';

interface DriveWindowProps {
    window: WINDOW;
    drive: DRIVE;
    token: string;
    currentDirectoryID: string;
    onAuthSuccess(drive: DRIVE, authData: AuthData): any;
    onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string): any;
    onSelectedItemsUpdate(srcDrive: DRIVE, selectedItems: any): any;
}

class DriveWindow extends Component<DriveWindowProps, any> {
    private DriveDirSelector = null as any;
    public getDriveDirectorySelector = () => {
        if(this.DriveDirSelector == null){
            let drive: DRIVE = this.props.drive;
            let driveConfig: DriveConfig = config[drive];
            class DriveDirSelector extends Drive {
                drive: DRIVE = drive;
                api: API = driveConfig.dirSelector.api;
                rootDirectoryID: string = driveConfig.dirSelector.rootDirectoryID
            }

            this.DriveDirSelector = DriveDirSelector;
        }

        return this.DriveDirSelector;
    }

    public render() {
        let DriveDirSelector = this.getDriveDirectorySelector();
        let { window, drive, token, currentDirectoryID } = this.props;

        return (
            this.props.token ?
            <DriveDirSelector
                window={window}
                token={token}
                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.props.onCurrentDirectoryIDUpdate(drive, newID)}
                currentDirectoryID={currentDirectoryID}
                onSelectedItemsUpdate={
                    (srcDrive: DRIVE, selectedItems: any) => this.props.onSelectedItemsUpdate(srcDrive, selectedItems)
                }
            />: 
            <Login config={config[drive]}/>
        );
    }
}

export default DriveWindow;