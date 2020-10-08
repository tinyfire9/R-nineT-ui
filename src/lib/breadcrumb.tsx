import React from 'react';
import { DIRECTORY_TYPE } from '../constants';

export interface BreadCrumbItem {
    id: string;
    name: string;
    type: DIRECTORY_TYPE;
}

interface BreadCrumbProps {
    breadcrumbItems: BreadCrumbItem[];
    fetchSubDirectories: (id: string) => any;
}

class Breadcrumb extends React.Component<BreadCrumbProps, any> {
    public static defaultProps = {
        breadcrumbItems: [],
        fetchSubDirectories() {}
    }
    public render() {
        let breadcrumbItems = this.props.breadcrumbItems.map(
            ({ name, id, type }: BreadCrumbItem, i: number) => {
                return (
                    <span key={id}>
                        <a
                            style={
                                {
                                    cursor: 'pointer',
                                    color: (type == DIRECTORY_TYPE.DIRECTORY) ? 'blue': '',
                                    borderBottom: (type == DIRECTORY_TYPE.DIRECTORY) ? '1px solid blue': ''
                                }
                            }
                            onClick={() => this.props.fetchSubDirectories(id)} >{name}
                        </a>
                        <span>/</span> 
                    </span>
                );
            }
        );

        breadcrumbItems.pop();

        return (
            <div>{ breadcrumbItems }</div>
        );
    }
}

export default Breadcrumb;