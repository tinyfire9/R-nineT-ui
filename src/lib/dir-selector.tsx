import React from 'react';
import { DriveDirectory } from '../interfaces';
import { DIRECTORY_TYPE } from '../constants';
import { HTMLTable, Checkbox, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

interface DirSelectorViewProps {
    currentDirId: string;
    subdirectory: DriveDirectory[];
    fetchSubDirectories(id: string, name: string, type: DIRECTORY_TYPE): any;
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
        fetchSubDirectories: () => {},
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
                            <Checkbox 
                                checked={selected_subdirectories[`${id}`]}
                                onClick={() => this.onSelectedSubDirListUpdate(`${id}`)}
                            />
                        </td>
                        <td><Icon icon={type == DIRECTORY_TYPE.DIRECTORY ? IconNames.FOLDER_CLOSE : IconNames.DOCUMENT} intent={Intent.PRIMARY}/></td>
                        <td>
                            <a
                                onClick={() => {
                                    if(type == DIRECTORY_TYPE.DIRECTORY) {
                                        this.props.fetchSubDirectories(id, name, type);
                                    }
                                }}
                            >
                                { name }
                            </a>
                        </td>
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
                <HTMLTable className="drive-dir-selector-table" style={{border: 'black'}}>
                    <thead>
                        <tr>
                            <td>
                                <Checkbox
                                    checked={this.state.select_all_active}
                                    onClick={() => this.toggleSelectAll()}
                                />
                            </td>
                            <td />
                            <td>Name</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.makeTableRows() }
                    </tbody>
                </HTMLTable>
                {this.props.currentDirId ? <button onClick={() => this.props.fetchNextPage()}>Load more ⬇️ </button> : ''}
                <br/>
            </React.Fragment>
        );
    }
}

export default DirSelectorView;