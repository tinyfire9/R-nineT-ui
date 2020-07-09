export enum DIRECTORY_TYPE {
     'FILE' = 'file',
     'DIRECTORY' = 'directory'
}

export interface DirectoryBase {
    name: string;
    type: DIRECTORY_TYPE;
}

export interface GDriveDirectory extends DirectoryBase {
    id: string;
}

export type DriveDirectory = DirectoryBase | GDriveDirectory;
