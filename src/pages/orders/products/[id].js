import React, {Component} from 'react';
import AppLayout from '../../layout/app-layout';
import {Row} from 'react-bootstrap';
import CustomTable from '../../../components/custom-table';
import { getAllOrderProductsWithCustomParamsFilter } from '../../../networking/external-url';


const TableWrapper = (props) => {
    const productImageFormatter = (cell, row) => {
        return (
            <img className="image-responsive-half" src="https://dummyimage.com/600x400/000/fff" alt="Product Image" />
        );
    }

    const columns = [
        {
            dataField: 'id',
            text: 'ID'
        },
        {
            dataField: 'primaryPhotoUrl',
            text: 'Product Image',
            formatter: productImageFormatter
        }, 
        {
            dataField: 'productName',
            text: 'Product Name'
        },
        {
            dataField: 'productPrice',
            text: 'Product Price'
        },
        {
            dataField: 'quantityRequested',
            text: 'Quantity Requested'
        },
        {
            dataField: 'productVendor',
            text: 'Created By',
            formatter: (cell, row) => {
                return (
                    <span>{cell.firstName + ' ' + cell.lastName}</span>
                );
            } 
        },
    ];

    return <CustomTable columns={columns} ajaxUrl={getAllOrderProductsWithCustomParamsFilter + props.orderId} dataName="orderProducts" />;
}

export default class ViewOrderProducts extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <AppLayout pageName="Order Products">
                {/* <Row as="div">
                    <CustomTable data={orderProducts} columns={columns} />
                </Row> */}
                <Row as="div">
                    <TableWrapper orderId={this.props.id} />
                </Row>
            </AppLayout>
        );
    }
}