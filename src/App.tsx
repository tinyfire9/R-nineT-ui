import React from 'react';
import App from '../src/app/app';

class GDrive extends React.Component<any, any> {

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center" }}>
            <h1>Drive App</h1>
            <App />
          </div>
        </header>
      </div>
    );
  }
}

export default GDrive;