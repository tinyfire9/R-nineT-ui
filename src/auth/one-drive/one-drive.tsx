import React from 'react';
import MSLogin from 'react-microsoft-login'
import { AuthData } from '../../app/interfaces';
import { DRIVE } from '../../constants';

interface OneDriveProps {
    onAuthSuccess:(drive: DRIVE, authData: AuthData) => any;
}

class OneDriveLogin extends React.Component<OneDriveProps, any> {
    public onAuthSuccess(res: any) {
        let authData: AuthData = {
            token: res.authResponseWithAccessToken.accessToken,
            name: res.authResponseWithAccessToken.account.name,
            email: res.authResponseWithAccessToken.account.userName,
            expiration_time: new Date(res.authResponseWithAccessToken.expiresOn).getTime(),
            image_url: '',
        };

        this.props.onAuthSuccess(DRIVE.ONE_DRIVE, authData);
    }

    public render() {
        return (
            <MSLogin 
                clientId="12f99e3f-599e-47ce-b76f-966d36fbe5d5"
                authCallback={(err: any, data: any) => {
                    if(data) {
                        this.onAuthSuccess(data);
                    } else {
                        console.log({err});
                    }
                }}
                graphScopes={['Files.ReadWrite.All']}
            />
        );
    }
}

export default OneDriveLogin;