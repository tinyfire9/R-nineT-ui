import React from 'react';
import MSLogin from 'react-microsoft-login'

class OneDriveLogin extends React.Component {
    public oneDriveOnResponse(err: any, data: any) {
        console.log({
            err, data
        });
    }

    public render() {
        return (
            <MSLogin 
                clientId="12f99e3f-599e-47ce-b76f-966d36fbe5d5"
                authCallback={this.oneDriveOnResponse}
            />
        );
    }
}