
import { DRIVE } from '../constants';

export interface AuthData {
    token: string;
    name: string;
    image_url: string;
    email: string;
    expiration_time: number;
};

export interface DriveState {
    drive: DRIVE;
    authData: AuthData,
    current_directory: Object | any;
}

export interface TransferSession {
    id: string;
    name: string;
    source_drive: DRIVE;
    destination_drive: DRIVE;
    transfer_percentage: number;
}

export interface StoreState {
    drives: DriveState[];
    transfer_sessions: TransferSession[];
}