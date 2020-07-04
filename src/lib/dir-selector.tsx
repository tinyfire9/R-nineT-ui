import React from 'react';
import { DriveDirectory, DirectoryType } from '../interfaces';

interface DirSelectorViewProps {
    currentDirId: string;
    subdirectory: DriveDirectory[];
    listGDriveSubDir(id: string, name: string, type: DirectoryType): any;
    transferDirectories(dirs: string[]): any;
    fetchNextPage(): any;
}

interface DirSelectorViewState {
    selected_subdirectories: { [key:string]: boolean };
    select_all_active: boolean;
}

class DirSelectorView extends React.Component<DirSelectorViewProps, DirSelectorViewState>{
    public static defaultProps = {
        currentDirId: '',
        subdirectory: [],
        listGDriveSubDir: () => {},
        transferDirectories: () => {}
    };

    constructor(props: DirSelectorViewProps) {
        super(props);
        this.state = {
            select_all_active: false,
            selected_subdirectories: {}
        };
    }

    public componentWillReceiveProps(newProps: DirSelectorViewProps) {
        if(this.props.currentDirId != newProps.currentDirId) {
            this.setState({
                select_all_active: false,
                selected_subdirectories: {}
            })
        }
    }

    public toggleSelectAll() {
        if(this.state.select_all_active) {
            this.setState({
                select_all_active: false,
                selected_subdirectories: {},
            });
        }  else {
            let selected_subdirectories: any = {};
            this.props.subdirectory.forEach(({ id }: any) => {
                selected_subdirectories[`${id}`] = true;
            })
            this.setState({
                select_all_active: true,
                selected_subdirectories, 
            });
        }
    }

    public onSelectedSubDirListUpdate(id: string) {
        const { selected_subdirectories } = this.state;

        let newState: DirSelectorViewState = { ...this.state };
        newState.selected_subdirectories[id] = !selected_subdirectories[id] ? true : false;
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
                    <tr key={id}>
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
                <button onClick={() => this.props.transferDirectories(selected_subdirectories)}>
                    Transfer {selected_subdirectories.length} items >  
                </button>
                <table className="drive-dir-selector-table" style={{border: 'black'}}>
                    <thead>
                        <tr>
                            <td>
                                <input 
                                    type="checkbox"
                                    checked={this.state.select_all_active}
                                    onClick={() => this.toggleSelectAll()}
                                />
                            </td>
                            <td>File Name</td>
                            <td>File Type</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.makeTableRows() }
                    </tbody>
                </table>
                {this.props.currentDirId ? <button onClick={() => this.props.fetchNextPage()}>Load more ⬇️ </button> : ''}
                <br/>
            </React.Fragment>
        );
    }
}

export default DirSelectorView;