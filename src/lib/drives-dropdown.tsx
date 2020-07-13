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
    public toDisplayName(drive: DRIVE) {
        return drive.split('_').map((word: string) => word[0].toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    public render() {
        return (
            <React.Fragment>
                <label>Select Drive: </label>
                <select>
                    {
                        Object.keys(this.props.drives)
                            .map((drive: any) => {
                                return (
                                    <option
                                        disabled={this.props.leftWindowDrive == drive || this.props.rightWindowDrive == drive}
                                        onClick={() => this.props.onDriveSelect(drive)}
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