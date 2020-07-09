import React from 'react';
import { GraphFileBrowser } from '@microsoft/file-browser';

interface OneDriveProps {
    token: string;
}

interface OneDriveDirectory {
    endpoint: string;
    drive_id: string;
    item_id: string;
}

class OneDrive extends React.Component<OneDriveProps, any> {
    public transferItems(dirs: OneDriveDirectory[]) {
        console.log({ dirs })
    }

    public render() {
        return (
            this.props.token ? 
                <GraphFileBrowser
                    itemMode={"folders"}
                    getAuthenticationToken={() => {
                        return new Promise((resolve: any, reject: any) => resolve(this.props.token))
                    }}
                    onSuccess={(dirs: any) => this.transferItems(dirs)}
                /> :
                ''
        );
    }
}

export default OneDrive;