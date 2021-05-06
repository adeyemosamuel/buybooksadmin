import React, {Component} from 'react';
import {Row} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import CustomTable from '../../components/custom-table';

const transactions = [
    {id: 1, orderId: "BBIP-001", totalPrice: 1900, shippingCost: 500, totalNumberOfProducts: 4, transactionDate: "2020-12-15 T 22:44"},
    {id: 2, orderId: "BBIP-1234", totalPrice: 800, shippingCost: 200, totalNumberOfProducts: 1, transactionDate: "2020-12-30 T 11:24"}
];

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },  
    {
        dataField: 'orderId',
        text: 'Order ID'
    },
    {
        dataField: 'totalPrice',
        text: 'Total Price'
    },
    {
        dataField: 'shippingCost',
        text: 'Shipping Cost'
    },
    {
        dataField: 'totalNumberOfProducts',
        text: 'Total Number of Products'
    },
    {
        dataField: 'transactionDate',
        text: 'Transaction Date'
    }
];

export default class ViewAll extends Component {
  render() {
    return(
      <AppLayout pageName="View All Transactions">
        <Row as="div">
            <CustomTable data={transactions} columns={columns} />
        </Row>
      </AppLayout>
    );
  }
}