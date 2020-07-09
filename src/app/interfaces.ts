
import { DRIVE } from '../app.config';

export enum WINDOW {
    LEFT = 'left',
    RIGHT = 'right',
    NONE = 'none'
}

export interface DriveState {
    drive: DRIVE;
    active: boolean;
    window: WINDOW;
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
    source_drive: DRIVE;
    destination_drive: DRIVE;
    transfer_percentage: number;
}

export interface StoreState {
    drives: DriveState[];
    transfer_sessions: TransferSession[];
}