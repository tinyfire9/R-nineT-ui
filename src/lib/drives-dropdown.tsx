import React from 'react';
import { Drives, WINDOW } from '../app/interfaces';
import { DRIVE } from '../constants'

interface DrivesDropdownProps {
    leftWindowDrive: DRIVE;
    rightWindowDrive: DRIVE;
    window: WINDOW;
    drives: Drives;
    onDriveSelect(drive: DRIVE): any
}

class DrivesDropdown extends React.Component<DrivesDropdownProps, any> {
    private toDisplayName(drive: DRIVE) {
        if(drive === DRIVE.UNDEFINED){
            return 'Select Drive';
        }

        return drive.split('_').map((word: string) => word[0].toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    private shouldDisable(drive: DRIVE){
        if(drive === DRIVE.UNDEFINED){
            return false;
        }

        return this.props.leftWindowDrive == drive || this.props.rightWindowDrive == drive;
    }

    public render() {
        return (
            <React.Fragment>
                <select onChange={e => this.props.onDriveSelect(e.target.value as any)}>
                    {
                        Object.keys(this.props.drives)
                            .map((drive: any) => {
                                return (
                                    <option
                                        disabled={this.shouldDisable(drive)}
                                        value={drive}
                                    >
                                        { this.toDisplayName(drive) }
                                    </option>
                                )
                            })
                    }
                </select>
            </React.Fragment>
        )
    }
}

export default DrivesDropdown;