
import { DRIVE } from '../constants';

export interface Drives {
    [drive: string]: DriveState
}

export enum WINDOW {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    expiresAt: number;
};

export interface DriveState {
    drive: DRIVE;
    authData: AuthData,
    currentDirectoryID: string;
    selectedItems: string[];
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