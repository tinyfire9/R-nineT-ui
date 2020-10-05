import React from 'react';
import Drive from '../../lib/drive';
import { DRIVE } from '../../constants';
import DropboxAPI from '../../service/dropbox/api';

class Dropbox extends Drive {
    drive:DRIVE = DRIVE.DROPBOX;
    rootDirectoryID = '';
    api = new DropboxAPI();
    fetchNextPage = () => {}
}

export default Dropbox;