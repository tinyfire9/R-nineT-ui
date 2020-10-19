import { GDrive, OneDrive, Box } from './app/transfer/drives';
import { GDriveAuth, OneDriveAuth, BoxAuth, DropboxAuth } from './auth';
import { DRIVE } from './constants'
import Dropbox from './app/transfer/drives/dropbox';

interface DriveComponents {
    authComponent:  typeof GDriveAuth | typeof OneDriveAuth | typeof BoxAuth | typeof DropboxAuth;
    dirSelectorComponent: typeof GDrive | typeof OneDrive | typeof Box | typeof Dropbox;
}

export const DRIVE_COMPONENTS: {[drive: string] : DriveComponents } = {
    [DRIVE.GOOGLE_DRIVE] :{
        authComponent: GDriveAuth,
        dirSelectorComponent: GDrive,
    },
    [DRIVE.ONE_DRIVE]: {
        authComponent: OneDriveAuth,
        dirSelectorComponent: OneDrive,
    },
    [DRIVE.BOX]: {
        authComponent: BoxAuth,
        dirSelectorComponent: Box
    },
    [DRIVE.DROPBOX]: {
        authComponent: DropboxAuth,
        dirSelectorComponent: Dropbox
    }
};
