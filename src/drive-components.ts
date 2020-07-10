import { GDrive, OneDrive } from './app/index';
import { GDriveAuth, OneDriveAuth } from './auth';
import { DRIVE } from './constants'

interface DriveComponents {
    drive: DRIVE;
    authComponent: any;
    dirSelectorComponent: any;
}

export const DRIVE_COMPONENTS: DriveComponents[] = [
    {
        drive: DRIVE.GOOGLE_DRIVE,
        authComponent: GDriveAuth,
        dirSelectorComponent: GDrive,
    },
    {
        drive: DRIVE.ONE_DRIVE,
        authComponent: OneDriveAuth,
        dirSelectorComponent: OneDrive,
    }
];
