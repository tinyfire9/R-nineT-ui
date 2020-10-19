import React from 'react';
import { DRIVE } from '../../../constants';
import Drive from '../../../lib/drive';
import GDriveAPI from '../../../service/gdrive/api';

class GoogleDrive extends Drive {
  drive: DRIVE = DRIVE.GOOGLE_DRIVE;
  rootDirectoryID: string = 'root';
  api: GDriveAPI = new GDriveAPI();
}

export default GoogleDrive;

