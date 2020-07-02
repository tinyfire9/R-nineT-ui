import React, { ReactElement } from 'react';
import { GoogleLogin } from 'react-google-login';
import DirSelectorView from '../../lib/dir-selector';

class GDriveAuth extends React.Component {
    public componentDidMount(){
        let script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        document.body.appendChild(script);
    }

    public onResponse(res: any, type: string) {
        console.log(type);
        console.log(res);
    }

    public render() {
        return (
            <div>
                <GoogleLogin
                    clientId="609636173272-ibmdbh1uki3smkdqjbrga0ig3490mhc8.apps.googleusercontent.com"
                    onSuccess={(res) => { this.onResponse(res, 'success');}}
                    onFailure={(res) => { this.onResponse(res, 'error')}}
                    buttonText="Google Drive"
                    isSignedIn={true}
                />
                <br/>
            </div>
        );
    }
}

export default GDriveAuth;