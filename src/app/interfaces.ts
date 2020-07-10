
import { DRIVE } from '../constants';

export enum WINDOW {
    LEFT = 'left',
    RIGHT = 'right',
    NONE = 'none'
}

export interface AuthData {
    token: string;
    name: string;
    image_url: string;
    email: string;
    expiration_time: number;
};

export interface DriveState {
    drive: DRIVE;
    active: boolean;
    window: WINDOW;
    authData: AuthData,
    active_path: string;
    selected_items: string[];
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