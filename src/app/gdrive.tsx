import React from 'react';
import API from '../service/gdrive/api'
import DirSelectorView from '../lib/dir-selector';
import GDriveBreadCrumb, { BreadCrumbItem } from './gdrive-bread-crumb';
import { DIRECTORY_TYPE, DRIVE } from '../constants';
import { DriveDirectory } from '../interfaces';

interface GDriveProps {
  token: string;
  onTransferRequest(srcDrive: DRIVE, selectedItems: any): any;
}

interface GDriveState {
  currentDirId: string;
  nextPageToken: string;
  subDir: DriveDirectory[];
  breadcrumbItems: BreadCrumbItem[];
}

class GDrive extends React.Component<GDriveProps, GDriveState> {
  private api: API = new API();
  constructor(props: any) {
    super(props);

    this.state = {
      currentDirId: '',
      nextPageToken: '',
      subDir: [],
      breadcrumbItems: [this.makeRootDirBreadCrumb()],
    }
  }

  public makeRootDirBreadCrumb = () => ({
    id: 'root',
    name: 'Drive',
    type: DIRECTORY_TYPE.DIRECTORY,
  });

  public updateBreadCrumb(id: string) {
    let breadcrumbItems = [...this.state.breadcrumbItems];
    let i = breadcrumbItems.findIndex((item: any) => item.id == id);

    for(let k = breadcrumbItems.length -1 ; k > i ; k--) {
      breadcrumbItems.pop();
    }

    return breadcrumbItems;
  }

  public fetchSubDirectory(dir_id: string) {
    this.api.fetchSubDirectory(this.props.token, dir_id)
      .then((res: any) => {
        this.setState({
          currentDirId: dir_id,
          subDir: res.files,
          nextPageToken: res.nextPageToken,
          breadcrumbItems: this.updateBreadCrumb(dir_id),
        });
      });
  }

  public fetchSubDirectoryFromCurrentDirectory(id: string, name: string, type: DIRECTORY_TYPE) {
    let breadcrumbItems = [...this.state.breadcrumbItems];
    this.api.fetchSubDirectory(this.props.token, id)
      .then((res: any) => {
        console.log({ res })
        breadcrumbItems.push({
          id,
          name,
          type,
        });
        this.setState({
          currentDirId: id,
          subDir: res.files,
          nextPageToken: res.nextPageToken,
          breadcrumbItems,
        })
      })
  }

  public fetchNextPage() {
    const { nextPageToken, currentDirId } = this.state;

    if(!nextPageToken) {
      return;
    }

    this.api.fetchSubDirectory(this.props.token, currentDirId, nextPageToken)
      .then((res: any) => {
        let subDir = [...this.state.subDir, ... res.files];
        this.setState({
          subDir,
          nextPageToken: res.nextPageToken,
        })
      });

  }

  public render() {
    console.log({breadcrumbItems: this.state.breadcrumbItems});

    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { this.fetchSubDirectory('root')}}>Fetch Dir</button>
            {
              <React.Fragment>
                <GDriveBreadCrumb
                  breadcrumbItems={this.state.breadcrumbItems}
                  fetchSubDirectory={(id: string) => this.fetchSubDirectory(id)}
                />
                <DirSelectorView
                  currentDirId={this.state.currentDirId}
                  subdirectory={this.state.subDir} 
                  listGDriveSubDir={
                    (id: string, name: string, type: DIRECTORY_TYPE) => this.fetchSubDirectoryFromCurrentDirectory(id, name, type)
                  }
                  transferDirectories={(dirs: string[]) => this.props.onTransferRequest(DRIVE.GOOGLE_DRIVE, dirs)}
                  fetchNextPage={() => this.fetchNextPage()}
                /> 
              </React.Fragment>
            }
            
          </div>
        </header>
      </div>
    );
  }
}

export default GDrive;

