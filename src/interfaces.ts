import { DIRECTORY_TYPE } from './constants';

export interface DriveDirectory {
    id: string;
    name: string;
    type: DIRECTORY_TYPE;
}
