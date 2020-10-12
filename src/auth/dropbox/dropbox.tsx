import React from 'react';
import { Button } from '@blueprintjs/core';
import OAuth2Client from 'client-oauth2';

class Dropbox extends React.Component {
    public onLogin() {
        let dropboxAuth = new OAuth2Client({
            clientId:'gyk9ex16zbrt706',
            authorizationUri: 'https://www.dropbox.com/oauth2/authorize',
            redirectUri: window.origin + '?auth-drive=dropbox'
        });

        window.location.href = dropboxAuth.code.getUri();
    }

    public render() {
        return (
            <Button onClick={() => this.onLogin()}>Login to Dropbox</Button>
        )
    }
}

export default Dropbox;