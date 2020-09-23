import React from 'react';
import App from '../src/app/app';
import { BoxAPI } from '../src/service/box/api';
import { DRIVE } from './constants';


class RnineT extends React.Component<any, any> {
  public componentDidMount(){
    let url = new URLSearchParams(window.location.search);
    if(url.has('auth-drive')){
      let drive = url.get('auth-drive') || '';
      
      if(drive == DRIVE.BOX.toLowerCase()){
        let boxAPI: BoxAPI = new BoxAPI();
        boxAPI.getAndStoreToken(url.get('code') || '');
      }
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center" }}>
            <h1>R nineT</h1>
            <App />
          </div>
        </header>
      </div>
    );
  }
}

export default RnineT;