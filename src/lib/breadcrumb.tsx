import React from 'react';
import { DIRECTORY_TYPE } from '../constants';
import { IBreadcrumbProps, Breadcrumbs } from '@blueprintjs/core';

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

    private renderBreadcrumb  =({ text, ...props }: IBreadcrumbProps)  => (
        <Breadcrumb>{text}</Breadcrumb>
    );

    public render() {
        return (
            <Breadcrumbs
                className="r-ninet-drive-breadcrumb"
                currentBreadcrumbRenderer={this.renderBreadcrumb}
                items={this.props.breadcrumbItems.map(({ name, id, type}: BreadCrumbItem) => ({
                        text: name,
                        onClick: () => this.props.fetchSubDirectories(id),
                    })
                )}
            />
        );
    }
}

export default Breadcrumb;