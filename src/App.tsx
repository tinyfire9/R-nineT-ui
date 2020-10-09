import React from 'react';
import App from '../src/app/app';
import { BoxAPI } from '../src/service/box/api';
import { DRIVE } from './constants';
import DropboxAPI from './service/dropbox/api';
import './app.scss';
import GDriveAPI from './service/gdrive/api';


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
        }

        case DRIVE.GOOGLE_DRIVE.toLowerCase():{
          url = new URLSearchParams('?' + window.location.hash.substr(1))
          let gDriveAPI: GDriveAPI = new GDriveAPI();
          let accessToken = url.get('access_token') || '';
          let expiresIn = url.get('expires_in') || '';

          gDriveAPI.storeToken({ accessToken, expiresIn });
        }
      }
    }
  }

  public render() {
    return (
      <div className="r-ninet" style={{ textAlign: "center" }}>
        <h1>R nineT</h1>
        <App />
      </div>
    );
  }
}

export default RnineT;