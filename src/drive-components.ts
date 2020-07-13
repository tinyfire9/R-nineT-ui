import { GDrive, OneDrive } from './app/drives';
import { GDriveAuth, OneDriveAuth } from './auth';
import { DRIVE } from './constants'

interface DriveComponents {
    authComponent:  typeof GDriveAuth | typeof OneDriveAuth;
    dirSelectorComponent: typeof GDrive | typeof OneDrive;
}

export const DRIVE_COMPONENTS: {[drive: string] : DriveComponents } = {
    [DRIVE.GOOGLE_DRIVE] :{
        authComponent: GDriveAuth,
        dirSelectorComponent: GDrive,
    },
    [DRIVE.ONE_DRIVE]: {
        authComponent: OneDriveAuth,
        dirSelectorComponent: OneDrive,
    }
};