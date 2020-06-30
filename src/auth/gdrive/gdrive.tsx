import React from 'react';
import { GoogleLogin } from 'react-google-login';

class GDriveAuth extends React.Component {
    public onResponse(res: any, type: string) {
        console.log(type);
        console.log(res);
    }

    public render() {
        return (
            <GoogleLogin
                clientId="609636173272-ibmdbh1uki3smkdqjbrga0ig3490mhc8.apps.googleusercontent.com"
                onSuccess={(res) => { this.onResponse(res, 'success');}}
                onFailure={(res) => { this.onResponse(res, 'error')}}
                buttonText="Google Drive"
                isSignedIn={true}
            />
        );
    }
}

export default GDriveAuth;