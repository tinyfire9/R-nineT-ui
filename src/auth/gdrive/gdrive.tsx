import React, { ReactElement } from 'react';
import { GoogleLogin } from 'react-google-login';
import { DRIVE } from '../../constants';
import { AuthData } from '../../app/interfaces';

interface GDriveAuthProps {
    onAuthSuccess(drive: DRIVE, authData: AuthData): any;
}

class GDriveAuth extends React.Component<GDriveAuthProps, any> {
    public onAuthSuccess(res: any) {
        let authData: AuthData = {
            token: res.accessToken,
            email: res.profileObj.email,
            name: res.profileObj.name,
            image_url: res.profileObj.imageUrl,
            expiration_time: res.tokenObj.expires_at
        };

        this.props.onAuthSuccess(DRIVE.GOOGLE_DRIVE, authData);
    }

    public render() {
        return (
            <GoogleLogin
                clientId="609636173272-ibmdbh1uki3smkdqjbrga0ig3490mhc8.apps.googleusercontent.com"
                onSuccess={(response: any) => this.onAuthSuccess(response)}
                onFailure={(res) => { console.log(res)}}
                buttonText="Google Drive"
                isSignedIn={true}
            />
        );
    }
}

export default GDriveAuth;