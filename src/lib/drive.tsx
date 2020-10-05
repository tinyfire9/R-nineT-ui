import React from 'react';
import Breadcrumb from './breadcrumb';
import DirSelectorView from './dir-selector';
import { DRIVE, DIRECTORY_TYPE } from '../constants';

interface DriveProps {
    token: string;
    currentDirectoryID: string;
    onTransferRequest(srcDrive: DRIVE, selectedItems: any): any;
    onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string): any;
}

abstract class Drive extends React.Component<DriveProps, any>{
    abstract api: any;
    abstract rootDirectoryID: string;
    abstract drive: DRIVE;
    abstract fetchNextPage:() => any;

    constructor(props: DriveProps) {
        super(props);
        this.state = this.createInitialState();
    }

    private createInitialState = () => ({
        subDirectories: [],
        breadcrumbItems: [this.makeRootBreadcrumb()]
    });

    private makeRootBreadcrumb = () => ({id: this.rootDirectoryID || '', name: 'Drive', type: DIRECTORY_TYPE.DIRECTORY });

    private fetchSubDriectories(id: string, name: string, type: DIRECTORY_TYPE) {
        this.api.fetchSubDirectories(this.props.token, id, )
    }

    private updateBreadCrumb(id: string) {
        let breadcrumbItems = [...this.state.breadcrumbItems];
        let i = breadcrumbItems.findIndex((item: any) => item.id == id);
    
        for(let k = breadcrumbItems.length -1 ; k > i ; k--) {
          breadcrumbItems.pop();
        }
    
        return breadcrumbItems;
      }
    
      private fetchSubDirectoriesFromBreadcumb(directoryID: string) {
        this.api.fetchSubDirectories(this.props.token, directoryID)
          .then((res: any) => {
            this.props.onCurrentDirectoryIDUpdate(this.drive, directoryID);

            this.setState({
              subDirectories: res,
              breadcrumbItems: this.updateBreadCrumb(directoryID),
            });
          });
      }


    public componentDidMount() {
        this.api.fetchSubDirectories(this.props.token, this.rootDirectoryID)
            .then((subDirectories: any) => this.setState({...this.state, ... { subDirectories }}));
    }

    private fetchSubDirectories(id: string, name: string, type: DIRECTORY_TYPE) {
        this.api.fetchSubDirectories(this.props.token, id)
            .then((subDirectories: any) => {
                this.props.onCurrentDirectoryIDUpdate(this.drive, id);
                let newState = { ...this.state };
                newState.subDirectories = subDirectories;
                newState.breadcrumbItems.push({ id, name, type  });
                this.setState(newState);
            });
    }

    public render(){
        return (
            <React.Fragment>
                <Breadcrumb
                    breadcrumbItems={this.state.breadcrumbItems}
                    fetchSubDirectories={(id: string) => this.fetchSubDirectoriesFromBreadcumb(id)}
                />
                <DirSelectorView
                    currentDirId={this.props.currentDirectoryID}
                    subdirectory={this.state.subDirectories}
                    fetchSubDirectories={(id: string, name: string, type: DIRECTORY_TYPE) => this.fetchSubDirectories(id, name, type)}
                    transferDirectories={(selectedItems: string[]) => this.props.onTransferRequest(this.drive, selectedItems)}
                    fetchNextPage={() => this.fetchNextPage()}
                />
            </React.Fragment>
        );
    }
}

export default Drive;