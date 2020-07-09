import React from 'react';
import MSLogin from 'react-microsoft-login'
import OneDrive from '../../app/onedrive';

class OneDriveLogin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            token: '',
        };
    }
    public oneDriveOnResponse(err: any, data: any) {
        console.log({
            err, data
        });
        this.setState({ token: data.authResponseWithAccessToken.accessToken });
    }

    public render() {
        console.log(this.state.token)
        return (
            <React.Fragment>
                <MSLogin 
                    clientId="12f99e3f-599e-47ce-b76f-966d36fbe5d5"
                    authCallback={(err: any, data: any) => this.oneDriveOnResponse(err, data)}
                    graphScopes={['Files.ReadWrite.All']}
                />
                <OneDrive token={this.state.token} />
            </React.Fragment>
        );
    }
}

export default OneDriveLogin;