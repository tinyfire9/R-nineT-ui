import React from 'react';
import API from '../service/google-drive/api'
import DirSelectorView from '../lib/dir-selector';
import GDriveBreadCrumb from './gdrive-bread-crumb';
import { DirectoryType } from '../interfaces';

let token = "";
let api = new API();

class GDrive extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      token,
      nextPageToken: '',
      subDir: [],
      breadcrumbItems: [this.makeRootDirBreadCrumb()],
    }
  }

  public makeRootDirBreadCrumb = () => ({
    id: '_DRIVE_ROOT_DIR',
    name: 'Drive',
    type: 'Directory',
  });

  public fetchSubDirectory () {
    api.fetchSubDirectory(this.state.token)
      .then((res: any) => {
        this.setState({ nextPageToken: res.nextPageToken, subDir: res.files, breadcrumbItems: [] })
      }, (err) => console.log(err))
  }

  public updateBreadCrumb(id: string) {
    let breadcrumbItems = [...this.state.breadcrumbItems];
    let i = breadcrumbItems.indexOf((item: any) => item.id == id);
    for(let k = breadcrumbItems.length -1 ; k > i ; k--) {
      breadcrumbItems.pop();
    }
  }

  public fetchSubDirectoryFromBreadCrumb(dir_id: string) {
    api.fetchSubDirectory(this.state.token, dir_id == '_DRIVE_ROOT_DIR' ? '' : dir_id)
      .then((res: any) => {
        this.setState({
          subDir: res.files,
          nextPageToken: res.nextPageToken,
          breadcrumbItems: this.updateBreadCrumb(dir_id),
        });
      });
  }

  public fetchSubDirectoryFromCurrentDirectory(id: string, name: string, type: DirectoryType) {
    let breadcrumbItems = [...this.state.breadcrumbItems];
    api.fetchSubDirectory(this.state.token, id)
      .then((res: any) => {
        console.log({ res })
        breadcrumbItems.push({
          id,
          name,
          type,
        });
        this.setState({
          subDir: res.files,
          nextPageToken: res.nextPageToken,
          breadcrumbItems,
        })
      })
  }

  public render() {
    console.log({breadcrumbItems: this.state.breadcrumbItems});

    return (
      <div className="App">
        <header className="App-header">
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { this.fetchSubDirectory()}}>Fetch Dir</button>
            {
              this.state.subDir.length > 0 ? 
                <React.Fragment>
                  <GDriveBreadCrumb
                    breadcrumbItems={this.state.breadcrumbItems}
                    fetchSubDirectory={(id: string) => this.fetchSubDirectoryFromBreadCrumb(id)}
                  />
                  <DirSelectorView subdirectory={this.state.subDir} listGDriveSubDir={
                    (id: string, name: string, type: DirectoryType) => this.fetchSubDirectoryFromCurrentDirectory(id, name, type)
                  } /> 
                </React.Fragment>:
                ''
            }
            
          </div>
        </header>
      </div>
    );
  }
}

export default GDrive;

