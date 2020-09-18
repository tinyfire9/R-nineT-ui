import React from 'react';
import { BoxAPI } from '../../service/box/api'
import Breadcrumb from '../../lib/breadcrumb';
import DirSelectorView from '../../lib/dir-selector';
import { DRIVE, DIRECTORY_TYPE } from '../../constants';

interface BoxProps {
    token: string;
    currentDirectoryID: string;
    onTransferRequest(srcDrive: DRIVE, selectedItems: any): any;
    onCurrentDirectoryIDUpdate(drive: DRIVE, newID: string): any;
}

class Box extends React.Component<BoxProps, any>{
    constructor(props: BoxProps) {
        super(props);

        this.state = {
            subDirectories: [],
            breadcrumbItems: [this.makeRootBreadcrumb()]
        }
    }

    private api: BoxAPI = new BoxAPI();

    private makeRootBreadcrumb = () => ({id: '0', name: 'Drive', type: DIRECTORY_TYPE.DIRECTORY });

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
            this.props.onCurrentDirectoryIDUpdate(DRIVE.BOX, dir_id);

            this.setState({
              subDirectories: res,
              breadcrumbItems: this.updateBreadCrumb(dir_id),
            });
          });
      }


    public componentDidMount() {
        this.api.fetchSubDirectories(this.props.token, '0')
            .then((subDirectories: any) => this.setState({...this.state, ... { subDirectories }}));
    }

    public fetchSubDirectories(id: string, name: string, type: DIRECTORY_TYPE) {
        this.api.fetchSubDirectories(this.props.token, id)
            .then((subDirectories: any) => {
                this.props.onCurrentDirectoryIDUpdate(DRIVE.BOX, id);
                let newState = { ...this.state };
                newState.subDirectories = subDirectories;
                newState.breadcrumbItems.push({ id, name, type  });
                this.setState(newState);
            });
    }

    public render(){
        return(
            <React.Fragment>
                <Breadcrumb
                    breadcrumbItems={this.state.breadcrumbItems}
                    fetchSubDirectories={(id: string) => this.fetchSubDirectoriesFromBreadcumb(id)}
                />
                <DirSelectorView
                    currentDirId={this.props.currentDirectoryID}
                    subdirectory={this.state.subDirectories}
                    fetchSubDirectories={(id: string, name: string, type: DIRECTORY_TYPE) => this.fetchSubDirectories(id, name, type)}
                    transferDirectories={(selectedItems: string[]) => this.props.onTransferRequest(DRIVE.BOX, selectedItems)}
                    fetchNextPage={() => {}}
                />
            </React.Fragment>

        );
    }
}

export default Box;