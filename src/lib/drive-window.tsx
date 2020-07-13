import React, { Component } from 'react';
import { DRIVE } from '../constants'
import { AuthData } from '../app/interfaces';
import { DRIVE_COMPONENTS } from '../drive-components';

interface DriveWindowProps {
    drive: DRIVE;
    token: string;
    currentDirectoryID: string;
    onAuthSuccess(drive: DRIVE, authData: AuthData): any;
    onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string): any;
    onTransferRequest(srcDrive: DRIVE, selectedItems: any): any;
}

class DriveWindow extends Component<DriveWindowProps, any> {
    public render() {
        let { drive, token, currentDirectoryID } = this.props;
        let Drive = DRIVE_COMPONENTS[drive].dirSelectorComponent;
        let Auth = DRIVE_COMPONENTS[drive].authComponent;

        return (
            this.props.token ?
            <Drive
                token={token}
                onCurrentDirectoryIDUpdate={(drive: DRIVE, newID: string) => this.props.onCurrentDirectoryIDUpdate(drive, newID)}
                currentDirectoryID={currentDirectoryID}
                onTransferRequest={
                    (srcDrive: DRIVE, selectedItems: any) => this.props.onTransferRequest(srcDrive, selectedItems)
                }
            />: 
            <Auth onAuthSuccess={(drive: DRIVE, authData: AuthData) => this.props.onAuthSuccess(drive, authData)}/>
        );
    }
}

export default DriveWindow;