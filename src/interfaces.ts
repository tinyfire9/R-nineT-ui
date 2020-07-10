import { DIRECTORY_TYPE } from './constants';

export interface DirectoryBase {
    name: string;
    type: DIRECTORY_TYPE;
}

export interface GDriveDirectory extends DirectoryBase {
    id: string;
}

export type DriveDirectory = DirectoryBase | GDriveDirectory;
