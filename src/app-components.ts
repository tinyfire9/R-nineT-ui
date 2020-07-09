import { GDrive, OneDrive } from './app/index';
import { GDriveAuth, OneDriveAuth } from './auth';

export const enum DRIVE  {
    'GOOGLE_DRIVE'= 'google_drive',
    'ONE_DRIVE' = 'one_drive',
}

interface DriveConfig {
    drive: DRIVE;
    authComponent: any;
    dirSelectorComponent: any;
}

export const APP_COMPONENTS: DriveConfig[] = [
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
