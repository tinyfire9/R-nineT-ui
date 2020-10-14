import React from 'react';
import { DRIVE, DIRECTORY_TYPE } from '../../constants'
import Breadcrumb from '../../lib/breadcrumb';
import API from '../../service/onedrive/api';
import { DriveDirectory } from '../../interfaces';
import DirSelectorView from '../../lib/dir-selector';
import { WINDOW } from '../interfaces';

interface OneDriveProps {
    window: WINDOW;
    token: string;
    currentDirectoryID: string;
    onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string): any;
    onTransferRequest(src: DRIVE, selectedItems: any): any;
}

interface OneDriveState {
    subDirectories: DriveDirectory[];
    breadcrumbItems: DriveDirectory[];
}

class OneDrive extends React.Component<OneDriveProps, OneDriveState> {
    constructor(props: OneDriveProps) {
        super(props);

        this.state = {
            subDirectories: [],
            breadcrumbItems: [this.makeRootBreadcrumb()]
        }
    }

    private makeRootBreadcrumb = () => ({id: 'root', name: 'Drive', type: DIRECTORY_TYPE.DIRECTORY });

    public fetchSubDriectories(id: string, name: string, type: DIRECTORY_TYPE) {
        this.api.fetchSubDirectories(this.props.token, id, )
    }

    public updateBreadCrumb(id: string) {
        let breadcrumbItems = [...this.state.breadcrumbItems];
        let i = breadcrumbItems.findIndex((item: any) => item.id == id);
    
        for(let k = breadcrumbItems.length -1 ; k > i ; k--) {
          breadcrumbItems.pop();
        }
    
        return breadcrumbItems;
      }
    
      public fetchSubDirectoriesFromBreadcumb(dir_id: string) {
        this.api.fetchSubDirectories(this.props.token, dir_id)
          .then((res: any) => {
            this.props.onCurrentDirectoryIDUpdate(DRIVE.ONE_DRIVE, dir_id);

            this.setState({
              subDirectories: res,
              breadcrumbItems: this.updateBreadCrumb(dir_id),
            });
          });
      }

    private api: API = new API();
    public componentDidMount() {
        this.api.fetchSubDirectories(this.props.token)
            .then((subDirectories: any) => this.setState({...this.state, ... { subDirectories }}));
    }

    public fetchSubDirectories(id: string, name: string, type: DIRECTORY_TYPE) {
        this.api.fetchSubDirectories(this.props.token, id)
            .then((subDirectories: any) => {
                this.props.onCurrentDirectoryIDUpdate(DRIVE.ONE_DRIVE, id);
                let newState = { ...this.state };
                newState.subDirectories = subDirectories;
                newState.breadcrumbItems.push({ id, name, type  });
                this.setState(newState);
            });
    }

    public render() {
        return (
            this.props.token ?
                <React.Fragment>
                    <Breadcrumb
                        breadcrumbItems={this.state.breadcrumbItems}
                        fetchSubDirectories={(id: string) => this.fetchSubDirectoriesFromBreadcumb(id)}
                    />
                    <DirSelectorView
                        window={this.props.window}
                        currentDirId={this.props.currentDirectoryID}
                        subdirectory={this.state.subDirectories}
                        fetchSubDirectories={(id: string, name: string, type: DIRECTORY_TYPE) => this.fetchSubDirectories(id, name, type)}
                        transferDirectories={(selectedItems: string[]) => this.props.onTransferRequest(DRIVE.ONE_DRIVE, selectedItems)}
                        fetchNextPage={() => {}}
                    />
                </React.Fragment>
                : ''
                
        );
    }
}

export default OneDrive;