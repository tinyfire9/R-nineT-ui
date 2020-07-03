import React from 'react';
import { DriveDirectory, DirectoryType } from '../interfaces';

interface DirSelectorViewProps {
    subdirectory: DriveDirectory[];
    listGDriveSubDir(id: string, name: string, type: DirectoryType): any;
    transferDirectories(dirs: string[]): any;
}

interface DirSelectorViewState {
    selected_subdirectories: { [key:string]: boolean };
}

class DirSelectorView extends React.Component<DirSelectorViewProps, DirSelectorViewState>{
    public static defaultProps = {
        subdirectory: [],
        listGDriveSubDir: () => {},
        transferDirectories: () => {}
    };

    constructor(props: DirSelectorViewProps) {
        super(props);

        this.state = {
            selected_subdirectories: {}
        };
    }

    public onSelectedSubDirListUpdate(path: string) {
        const { selected_subdirectories } = this.state;

        let newState: DirSelectorViewState = { ...this.state };
        newState.selected_subdirectories[path] = !selected_subdirectories[path] ? true : false;
        this.setState(newState);
    }

    private getSelectedDirectories(){
        let { selected_subdirectories } = this.state;

        return Object.keys(selected_subdirectories)
            .filter((dir: string) => {
                return selected_subdirectories[dir] == true;
            });
    }

    public makeTableRows() {
        let { selected_subdirectories } = this.state;

        return this.props.subdirectory
            .map(({ name, id, type }: any) => {
                return (
                    <tr>
                        <td>
                            <input 
                                type="checkbox"
                                checked={selected_subdirectories[`${id}`]}
                                onClick={() => this.onSelectedSubDirListUpdate(`${id}`)}
                            />
                        </td>
                        <td>
                            <a
                                style={
                                    {
                                        color: (type == 'Directory') ? 'blue': '',
                                        borderBottom: (type == 'Directory') ? '1px solid blue': ''}
                                }
                                onClick={() => {
                                    if(type == 'Directory') {
                                        this.props.listGDriveSubDir(id, name, type);
                                    }
                                }}
                            >
                                { name }
                            </a>
                        </td>
                        <td>-</td>
                        <td>{type}</td>
                        <td>-</td>
                    </tr>
                );
            });
    }

    public render() {
        let selected_subdirectories = this.getSelectedDirectories();

        return (
            <React.Fragment>
                <table className="drive-dir-selector-table" style={{border: 'black'}}>
                    <thead>
                        <tr>
                            <td></td>
                            <td>File Name</td>
                            <td>File Type</td>
                            <td>File Size</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.makeTableRows() }
                    </tbody>
                </table>
                <button onClick={() => this.props.transferDirectories(selected_subdirectories)}>
                    Transfer {selected_subdirectories.length} items >  
                </button>
            </React.Fragment>
        );
    }
}

export default DirSelectorView;