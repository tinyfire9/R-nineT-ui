import { DriveConfig } from "./interfaces";
import { config as googleDriveConfig } from './google-drive';
import { config as oneDriveConfig } from './one-drive';
import { config as boxConfig } from './box';
import { config as dropboxConfig } from './dropbox';

let config: {[drive: string]: DriveConfig} = {
    [`${googleDriveConfig.name}`]: googleDriveConfig,
    [`${oneDriveConfig.name}`]: oneDriveConfig,
    [`${boxConfig.name}`]: boxConfig,
    [`${dropboxConfig.name}`]: dropboxConfig,
}

export { config };