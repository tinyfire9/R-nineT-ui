import React from 'react';
import ClientOAuth2 from 'client-oauth2'
import { Button } from '@blueprintjs/core';
import { DriveConfig, AUTH_TYPE } from '../app/transfer/drives/interfaces';

interface LoginProps {
    config: DriveConfig
}

class Login extends React.Component<LoginProps, any> {
    constructor(props: LoginProps){
        super(props);
    }

    private onLogin() {
        const { config: { auth: { type, authorizationUri, clientID: clientId, scopes, redirectUri } } } = this.props;
        let auth = new ClientOAuth2({
            authorizationUri,
            redirectUri,
            clientId,
            scopes,
        });

        let uri = type === AUTH_TYPE.CODE ? auth.code.getUri() : auth.token.getUri();
        window.location.href = uri;
    }

    public render() {
        return (
            <Button onClick={() => {
                console.log('login')
                this.onLogin()
            }}>Login to {this.props.config.displayName}</Button>
        );
    }
}

export default Login;