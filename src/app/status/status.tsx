import React from 'react';
import { HTMLTable, ProgressBar, Intent, Card, Spinner, Icon } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';

interface JobStatus {
    jobID: string;
    srcDrive: string;
    destDrive: string;
    timestamp: number;
    totalSize: number;
    uploadedSize: number;
    totalItemsCount: number;
    uploadedItemsCount: number;
    errorItemsCount: number;
}

interface StatusViewState {
    status: JobStatus[];
    showSpinner: boolean;
}

class StatusView extends React.Component<any, StatusViewState> {
    private interval: NodeJS.Timer = null as any;
    constructor(props: any) {
        super(props);
        this.state = {
            status: [],
            showSpinner: true
        }
    }

    public componentDidMount(){
        this.interval = setInterval(() => {
            this.fetchStatus();
        }, 1000)
    }

    public componentWillMount(){
        clearInterval(this.interval);
    }

    private fetchStatus() {
        if(this.state.status.length == 0){
            this.setState({...this.state, showSpinner: true});
        }

        let url = 'http://localhost:8080/status';

        fetch(url)
        .then(res => res.json())
        .then((status: JobStatus[]) => {
            this.setState({ status, showSpinner: false });
        })
    }

    private computeProgressValue({ totalSize, uploadedSize }: JobStatus){
        return uploadedSize / totalSize;
    }

    private toDisplayName(drive: string){
        return drive.split('_').map((word: string) => word[0].toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    private makeTableHead() {
        return (
            <thead>
                <tr style={{textAlign: 'center'}}>
                    <td></td>
                    <td></td>
                    <td>Source</td>
                    <td>Destination</td>
                    <td>Time Requested</td>
                    <td>Transfers</td>
                    <td>Errors</td>
                    <td>Total Size (MB)</td>
                </tr>
            </thead>
        );
    }

    private makeProgressIcon(jobStatus: JobStatus){
        if(jobStatus.totalItemsCount - jobStatus.errorItemsCount === jobStatus.uploadedItemsCount){
            let iconName;
            let intent: Intent;
            if(jobStatus.errorItemsCount > 0){
                iconName =jobStatus.errorItemsCount === jobStatus.totalItemsCount ?  IconNames.ERROR: IconNames.WARNING_SIGN;
                intent = jobStatus.errorItemsCount === jobStatus.totalItemsCount ? Intent.DANGER : Intent.WARNING;
            } else {
                iconName = IconNames.TICK_CIRCLE;
                intent = Intent.SUCCESS;
            }

            return (
                <Icon style={{ paddingLeft: '35%'}} icon={iconName as IconName} intent={intent} />
            );
        }
        
        return (
            <Spinner size={20} className="bp3-no-stripes" intent={Intent.SUCCESS} value={this.computeProgressValue(jobStatus)} />
        );
    }

    private onMouseOver (id: string) {
        let e = document.getElementById(id) as any;
        e.style.backgroundColor = 'rgba(245, 247, 249)';
    }

    private onMouseClick(id: string){
        let e = document.getElementById(id) as any;
        e.style.backgroundColor = 'rgba(236, 240, 244)';
    }

    private onMouseLeave(id: string){
        let e = document.getElementById(id) as any;
        e.style.backgroundColor = 'rgba(255, 255, 255)';
    }

    private makeTableBody(){
        return (
            <tbody>
                {
                    this.state.status
                        .sort((a: JobStatus, b: JobStatus) => {
                            if(a.timestamp < b.timestamp) {
                                return 1
                            } else if(a.timestamp > b.timestamp){
                                return -1;
                            }
                            return 0;
                        })
                        .map((jobStatus: JobStatus, i: number) => (
                                <tr
                                    id={jobStatus.jobID}
                                    onMouseOver={() => this.onMouseOver(jobStatus.jobID)} 
                                    onMouseLeave={() => this.onMouseLeave(jobStatus.jobID)}
                                    onClick={() => this.onMouseClick(jobStatus.jobID)}
                                >
                                    <td>{i+1}</td>
                                    <td>{this.makeProgressIcon(jobStatus)}</td>
                                    <td>{this.toDisplayName(jobStatus.srcDrive)}</td>
                                    <td>{this.toDisplayName(jobStatus.destDrive)}</td>
                                    <td>{new Date(jobStatus.timestamp).toLocaleString()}</td>
                                    <td>{`${jobStatus.uploadedItemsCount}/${jobStatus.totalItemsCount}`}</td>
                                    <td>{`${jobStatus.errorItemsCount}/${jobStatus.totalItemsCount}`}</td>
                                    <td>{(jobStatus.totalSize/1000000).toFixed(2)}</td>
                                </tr>
                            )
                        )
                    }
            </tbody>
        )
    }

    public render() {
        let cardStyle = {
            overflow: 'auto',
            marginTop: '2%',
            marginRight: '3%',
            marginLeft: '3%',
            minHeight: window.innerHeight * .87,
            maxHeight: window.innerHeight * .87
        };

        let spinnerStyle = {
            marginTop: window.outerHeight * .35
        }

        return (
            <Card style={cardStyle}>
                {
                    this.state.showSpinner ?
                        <div style={spinnerStyle}><Spinner size={35} intent={Intent.PRIMARY}/></div> : 
                        <HTMLTable style={{ width: '100%'}}>
                            {this.makeTableHead()}
                            {this.makeTableBody()}
                        </HTMLTable>
                }
            </Card>
        );
    }
}

export default StatusView;