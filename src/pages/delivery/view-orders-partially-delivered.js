import React, {Component} from 'react';
import {Row} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../components/custom-table';

const orders = [
    {id: 1, orderId: "BBIP-001", deliveryMethod: "Quick Delivery", totalPrice: 1900, orderedOn: "2020-12-15 T 11:44", orderedBy: "Joseph Patick", deliveryStatus: "PARTIALLY_DELIVERED", deliveredOn: "N/A", deliveryAddress: "11 Somolu Close by Bariga Layout, Lagos, Nigeria"},
    {id: 2, orderId: "BBIP-1234", deliveryMethod: "Slow Delivery", totalPrice: 800, orderedOn: "2020-12-30 T 11:24", orderedBy: "Alfred Patick", deliveryStatus: "PARTIALLY_DELIVERED", deliveredOn: "N/A", deliveryAddress: "15 Farida By-court, Lagos-Ibadan expressway"}
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
        dataField: 'deliveryMethod',
        text: 'Delivery Method'
    },
    {
        dataField: 'totalPrice',
        text: 'Total Price'
    },
    {
        dataField: 'orderedOn',
        text: 'Order Date'
    },
    {
        dataField: 'orderedBy',
        text: 'Ordered By'
    },
    {
        dataField: 'deliveryStatus',
        text: 'Delivery Status'
    },
    {
        dataField: 'deliveredOn',
        text: 'Delivered On'
    },
    {
        dataField: 'deliveryAddress',
        text: 'Delivery Address'
    },
    {
        dataField: "updateStatus",
        text: 'Update Status',
        formatter: (col, row) => {
            return (
                <span className="v-al-middle" title="Update" onClick={() => Router.push("/delivery/update-order-status/"+ row.id)}>
                    <FontAwesomeIcon icon={faUpload} size="lg" />
                </span>
            )
        }
    }
];

export default class ViewOrdersPartiallyDelivered extends Component {
  render() {
    return(
      <AppLayout pageName="View Orders Partially Delivered">
        <Row as="div">
            <CustomTable data={orders} columns={columns} />
        </Row>
      </AppLayout>
    );
  }
}