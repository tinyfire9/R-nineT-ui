import React from 'react';
import { SubDirectory } from '../interfaces';

interface DirSelectorViewProps {
    subdirectory: SubDirectory[];
    listSubDir(path: string, name: string): any;
}

interface DirSelectorViewState {
    selected_subdirectories: { [key:string]: boolean };
}

class DirSelectorView extends React.Component<DirSelectorViewProps, DirSelectorViewState>{
    public static defaultProps = {
        subdirectory: [],
        listSubDir: () => {}
    };

    constructor(props: DirSelectorViewProps) {
        super(props);

        this.state = {
            selected_subdirectories: {}
        };
    }

    public onSelectedSubDirListUpdate(path: string) {
        const { selected_subdirectories } = this.state;

        if(!selected_subdirectories[path]) {
            let newState: DirSelectorViewState = { ...this.state };
            newState.selected_subdirectories[path] = true;
            this.setState(newState);
        }
    }

    public makeTableRow() {
        return [(<tr><td>..</td></tr>), ...this.props.subdirectory
            .map(({ name, path, type }: SubDirectory) => {
                return (
                    <tr>
                        <td>
                            <div 
                                onClick={() => this.onSelectedSubDirListUpdate(`${path}/${name}`)}
                                onDoubleClick={() => {
                                    if(type == 'Directory') {
                                        this.props.listSubDir(path, name);
                                    }
                                }}
                            >
                                { name }
                            </div>
                        </td>
                        <td>-</td>
                        <td>{type}</td>
                        <td>-</td>
                    </tr>
                );
            })];
    }

    public render() {
        return (
            <table className="drive-dir-selector-table" style={{border: 'black'}}>
                <thead>
                    <tr>
                        <td>File Name</td>
                        <td>File Type</td>
                        <td>File Size</td>
                        <td>Last Modified</td>
                    </tr>
                </thead>
                <tbody>

                    { this.makeTableRow() }
                </tbody>
            </table>
        );
    }
}

export default DirSelectorView;