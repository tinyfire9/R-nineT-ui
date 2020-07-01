import React from 'react';
import { GoogleLogin } from 'react-google-login';
import OneDriveLogin from 'react-microsoft-login';

class GDriveAuth extends React.Component {
    public onResponse(res: any, type: string) {
        console.log(type);
        console.log(res);
    }

    public oneDriveOnResponse(err: any, data: any) {
        console.log({
            err, data
        });
    }

    public render() {
        return (
            <React.Fragment>
                <GoogleLogin
                    clientId="609636173272-ibmdbh1uki3smkdqjbrga0ig3490mhc8.apps.googleusercontent.com"
                    onSuccess={(res) => { this.onResponse(res, 'success');}}
                    onFailure={(res) => { this.onResponse(res, 'error')}}
                    buttonText="Google Drive"
                    isSignedIn={true}
                />
                <br/>
                <OneDriveLogin 
                    clientId="12f99e3f-599e-47ce-b76f-966d36fbe5d5"
                    authCallback={this.oneDriveOnResponse}
                />
            </React.Fragment>
        );
    }
}

export default GDriveAuth;