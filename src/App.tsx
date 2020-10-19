import React from 'react';
import TransferView from '../src/app/transfer/transfer';
import '@blueprintjs/core/lib/css/blueprint.css';
import './app.scss';

import { BoxAPI } from '../src/service/box/api';
import { DRIVE } from './constants';
import DropboxAPI from './service/dropbox/api';
import GDriveAPI from './service/gdrive/api';
import { Navbar, Button, Alignment, Icon, Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';


class RnineT extends React.Component<any, any> {
  public componentDidMount(){
    let url = new URLSearchParams(window.location.search);
    if(url.has('auth-drive')){
      let drive = url.get('auth-drive') || '';
      
      switch(drive){
        case DRIVE.BOX.toLowerCase():{
          let boxAPI: BoxAPI = new BoxAPI();
          boxAPI.getAndStoreToken(url.get('code') || '');
          break;
        }

        case DRIVE.DROPBOX.toLowerCase(): {
          let dropboxAPI: DropboxAPI = new DropboxAPI();
          dropboxAPI.getAndStoreToken(url.get('code') || '');
          break;
        }

        case DRIVE.GOOGLE_DRIVE.toLowerCase():{
          url = new URLSearchParams('?' + window.location.hash.substr(1))
          let gDriveAPI: GDriveAPI = new GDriveAPI();
          let accessToken = url.get('access_token') || '';
          let expiresIn = url.get('expires_in') || '';

          gDriveAPI.storeToken({ accessToken, expiresIn });
          break;
        }
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Navbar className="r-ninet-nav-bar">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <Icon color={Colors.BLUE2} iconSize={40} icon={IconNames.CLOUD}/>
              {/* <span style={{fontSize: '25px', paddingLeft: '15px'}}>R nineT</span> */}
            </Navbar.Heading>
          </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <Button minimal={true}>Home</Button>
              <Navbar.Divider/>
              <Button minimal={true}>Status</Button>
              <Navbar.Divider/>
              <Button minimal={true}>Notifications <Icon icon={IconNames.SYMBOL_TRIANGLE_DOWN} /></Button>
            </Navbar.Group>
        </Navbar>
        <div className="r-ninet" style={{ textAlign: "center" }}>
          <TransferView />
        </div>
      </React.Fragment>
    );
  }
}

export default RnineT;