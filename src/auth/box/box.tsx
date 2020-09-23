import React from 'react';
import clientOAuth2 from 'client-oauth2';

class BoxAuth extends React.Component<any, any> {
    private onClick(){
        let boxAuth = new clientOAuth2({
            clientId: 'inothb10fvq4yopnj2bzhh9khnawl4f5',
            authorizationUri: 'https://account.box.com/api/oauth2/authorize',
            redirectUri: window.location.origin + "?auth-drive=box",
        });

        window.location.href = boxAuth.code.getUri();
    }

    public render(){
        return (<button onClick={() => this.onClick()}>Login to Box</button>); 
    }
}

export default BoxAuth;