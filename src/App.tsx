import React from 'react';
import { Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import { Navbar, Button, Alignment, Icon, Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import '@blueprintjs/core/lib/css/blueprint.css';

import API from './app/transfer/drives/api';
import { TransferView, StatusView } from './app/index';
import { config } from './app/transfer/drives'
import { DRIVE } from './constants';
import './app.scss';


class RnineT extends React.Component<any, any> {
  public componentDidMount(){
    let url = new URLSearchParams(window.location.search);
    if(url.has('auth-drive')){
      let drive = url.get('auth-drive') || '';
      let driveConfig = config[drive];

      if(driveConfig === null){
        return; 
      }
      
      let api: API = driveConfig.dirSelector.api;

      switch(drive){
        case DRIVE.BOX.toLowerCase():{
          api.getAndStoreToken(url.get('code') || '');
          break;
        }
        case DRIVE.DROPBOX.toLowerCase(): {
          api.getAndStoreToken(url.get('code') || '');
          break;
        }

        case DRIVE.GOOGLE_DRIVE.toLowerCase():{
          url = new URLSearchParams('?' + window.location.hash.substr(1))
          let accessToken = url.get('access_token') || '';
          let expiresIn = url.get('expires_in') || '';

          api.storeToken({ accessToken, expiresIn });
          break;
        }
      }
    }
  }

  public render() {
    return (
      <BrowserRouter>
        <Navbar className="r-ninet-nav-bar">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <Icon color={Colors.BLUE2} iconSize={40} icon={IconNames.CLOUD}/>
              <span style={{fontSize: '25px', paddingLeft: '15px'}}>R nineT</span>
            </Navbar.Heading>
          </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <Link to="/"><Button minimal={true}>Home</Button></Link>
              <Navbar.Divider/>
              <Link to="/status"><Button minimal={true}>Status</Button></Link>
              <Navbar.Divider/>
              <Button minimal={true}>Notifications <Icon icon={IconNames.SYMBOL_TRIANGLE_DOWN} /></Button>
            </Navbar.Group>
        </Navbar>
        <div className="r-ninet" style={{ textAlign: "center" }}>
          <Switch>
            <Route exact path="/">
              <TransferView />
            </Route>
            <Route path="/status">
              <StatusView />
            </Route>
          </Switch>          
        </div>
      </BrowserRouter>
    );
  }
}

export default RnineT;