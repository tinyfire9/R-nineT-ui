import { GDrive, OneDrive, Box } from './app/drives';
import { GDriveAuth, OneDriveAuth } from './auth';
import { DRIVE } from './constants'

interface DriveComponents {
    authComponent:  typeof GDriveAuth | typeof OneDriveAuth | any;
    dirSelectorComponent: typeof GDrive | typeof OneDrive | typeof Box;
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
        authComponent: null,
        dirSelectorComponent: Box 
    }
};
