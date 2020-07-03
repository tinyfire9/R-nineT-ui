
export type Drive = 'GoogleDrive' | 'OneDrive' | 'BoxDrive' | 'DropboxDrive' | 'AmazonDrive';

export type DirectoryType = 'File' | 'Directory';

export interface DirectoryBase {
    name: string;
    type: DirectoryType;
}

export interface GDriveDirectory extends DirectoryBase {
    id: string;
}

export type DriveDirectory = DirectoryBase | GDriveDirectory;

export interface DriveState {
    drive_name: Drive;
    active: boolean;
    window: 'left' | 'right' | 'none';
    session: {
        token: string;
        active: boolean;
        name: string;
        image_url: string;
        email: string;
        expiration_time: number;
    },
    active_path: string;
    selected_items: string[];
}

export interface TransferSession {
    name: string;
    source_drive: Drive;
    destination_drive: Drive;
    transfer_percentage: number;
}

export interface StoreState {
    drives: DriveState[];
    transfer_sessions: TransferSession[];
}