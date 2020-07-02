
export type Drive = 'GoogleDrive' | 'OneDrive' | 'BoxDrive' | 'DropboxDrive' | 'AmazonDrive';

export type GraphNodeType = 'File' | 'Directory';

export interface DirectoryGraph {
    directory_name: string;
    path: string;
    type: GraphNodeType;
    subdirectory?: DirectoryGraph[];
}

export interface SubDirectory {
    name: string;
    path: string;
    type: GraphNodeType;
}

export interface DriveState {
    directory_graph: DirectoryGraph;
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