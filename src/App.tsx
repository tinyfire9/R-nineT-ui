import React from 'react';
import GDriveApp from '../src/app/gdrive';
import GDriveAuth from './auth/gdrive/gdrive';

class GDrive extends React.Component<any, any> {

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center" }}>
            <h1>Drive App</h1>
            <GDriveAuth />
            <GDriveApp />
          </div>
        </header>
      </div>
    );
  }
}

export default GDrive;

