import React from 'react';
import { DRIVE } from '../../constants';
import Drive from '../../lib/drive';
import GDriveAPI from '../../service/gdrive/api';

class GoogleDrive extends Drive {
  drive: DRIVE = DRIVE.GOOGLE_DRIVE;
  rootDirectoryID: string = 'root';
  api: GDriveAPI = new GDriveAPI();
  fetchNextPage = () =>{
    const { nextPageToken, currentDirId } = this.state;

    if(!nextPageToken) {
      return;
    }

    this.api.fetchSubDirectories(this.props.token, currentDirId, nextPageToken)
      .then((res: any) => {
        let subDir = [...this.state.subDir, ... res.files];
        this.setState({
          subDir,
          nextPageToken: res.nextPageToken,
        })
      });
  }
}

export default GoogleDrive;

