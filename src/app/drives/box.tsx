import React from 'react';
import { BoxAPI } from '../../service/box/api'
import { DRIVE } from '../../constants';
import Drive from '../../lib/drive';

class Box extends Drive {
    drive: DRIVE = DRIVE.BOX;
    rootDirectoryID: string = '0';
    api: BoxAPI = new BoxAPI()
    fetchNextPage = () => {}
}

export default Box;