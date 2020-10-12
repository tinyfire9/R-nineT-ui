import React from 'react';
import { Button } from '@blueprintjs/core';
import ClientOAuth2 from 'client-oauth2';

class GDriveAuth extends React.Component<any, any> {
    private onLogin(){
        let gDriveAuth = new ClientOAuth2({
            clientId: '719295962986-hhjcql786up8ifdho3pgd4mi73f4l92v.apps.googleusercontent.com',
            scopes: ["https://www.googleapis.com/auth/drive"],
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            redirectUri: window.origin + '?auth-drive=google_drive',
        });

        window.location.href = gDriveAuth.token.getUri();        
    }

    public render() {
        return <Button onClick={() =>this.onLogin()}>Login to Google Drive</Button>;
    }
}

export default GDriveAuth;