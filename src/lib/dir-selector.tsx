import React from 'react';
import { DriveDirectory } from '../interfaces';
import { DIRECTORY_TYPE } from '../constants';
import { HTMLTable, Checkbox, Icon, Intent, Card, Button, Tab } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';
import { ICON_LARGE } from '@blueprintjs/core/lib/esm/common/classes';
import { WINDOW } from '../app/interfaces';

interface DirSelectorViewProps {
    window: WINDOW;
    currentDirId: string;
    subdirectory: DriveDirectory[];
    fetchSubDirectories(id: string, name: string, type: DIRECTORY_TYPE): any;
    onSelectedItemsUpdate(dirs: string[]): any;
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
            this.props.onSelectedItemsUpdate([]);
        }  else {
            let selected_subdirectories: any = {};
            this.props.subdirectory.forEach(({ id }: any) => {
                selected_subdirectories[`${id}`] = true;
            })
            this.setState({
                select_all_active: true,
                selected_subdirectories, 
            });

            this.props.onSelectedItemsUpdate(Object.keys(selected_subdirectories));
        }
    }

    public onSelectedSubDirListUpdate(id: string) {
        const { selected_subdirectories } = this.state;

        let newState: DirSelectorViewState = { ...this.state };
        newState.selected_subdirectories[id] = !selected_subdirectories[id] ? true : false;
        this.setState(newState);

        this.props.onSelectedItemsUpdate(this.getSelectedDirectories())
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
        let icon:IconName = this.props.window === WINDOW.LEFT ? IconNames.CIRCLE_ARROW_RIGHT : IconNames.CIRCLE_ARROW_LEFT;

        return (
            <div>                
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
                <br/>
            </div>
        );
    }
}

export default DirSelectorView;