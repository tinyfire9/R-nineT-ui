import React from 'react';
import { DirectoryType } from '../interfaces';

interface BreadCrumbItem {
    id: string;
    name: string;
    type: DirectoryType;
}

interface GDriveBreadCrumbProps {
    breadcrumbItems: BreadCrumbItem[];
    fetchSubDirectory: (id: string) => any;
}

class GDriveBreadCrumb extends React.Component<GDriveBreadCrumbProps, any> {
    public static defaultProps = {
        breadcrumbItems: [],
        fetchSubDirectory() {}
    }
    public render() {
        console.log(this.props.breadcrumbItems)

        let { breadcrumbItems } = this.props;
        return (
            <div>
                {
                    this.props.breadcrumbItems.map(
                        ({ name, id, type }: BreadCrumbItem, i: number) => {
                            return (
                                <React.Fragment>
                                    <a
                                        style={
                                            {
                                                color: (type == 'Directory') ? 'blue': '',
                                                borderBottom: (type == 'Directory') ? '1px solid blue': ''}
                                        }
                                        onClick={() => this.props.fetchSubDirectory(id)} >{name}
                                    </a>
                                    <span>/</span> 
                                </React.Fragment>
                            );
                        }
                    )
                }
            </div>
        );
    }
}

export default GDriveBreadCrumb;