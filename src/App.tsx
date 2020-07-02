import React from 'react';
import GDriveAuth from './auth/google-drive/gdrive';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ textAlign: "center" }}>
          <h1>Drive App</h1>
          <GDriveAuth />
        </div>
      </header>
    </div>
  );
}

export default App;
