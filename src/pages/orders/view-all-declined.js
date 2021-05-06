import React, {Component} from 'react';
import {Row, Button, Container} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheck, faEye} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../components/custom-table';
import CustomModal from '../../components/custom-modal';
import { getAllOrdersWithCustomParamsFilter } from '../../networking/external-url';

const TableWrapper = () => {
    const columns = [
        {
            dataField: 'id',
            text: 'ID',
            sort: true
        }, 
        {
            dataField: 'orderId',
            text: 'Order ID',
            sort: true
        },
        {
            dataField: 'deliveryMethod',
            text: 'Delivery Method',
            formatter: (col, row) => {
                return col ? <span className="v-al-middle">{`${col.name} - (${col.start} to ${col.end} ${col.duration})`}</span> : <></>
            }
        },
        {
            dataField: 'deliveryMethod.price',
            text: 'Delivery Fee'
        },
        {
            dataField: 'totalPrice',
            text: 'Total Price',
            sort: true
        },
        {
            dataField: 'orderedOn',
            text: 'Order Date',
            sort: true
        },
        {
            dataField: 'orderedBy',
            text: 'Ordered By',
            formatter: (col, row) => {
                return col ? <span className="v-al-middle">{col.firstName + " " + col.lastName}</span> : <></>
            }
        },
        {
            dataField: 'orderStatus',
            text: 'Order Status',
            sort: true
        },
        {
            dataField: 'verifiedOn',
            text: 'Verified On',
            sort: true
        },
        {
            dataField: 'verifiedBy',
            text: 'Verified By',
            formatter: (col, row) => {
                return col ? <span className="v-al-middle">{col.firstName + " " + col.lastName}</span> : <></>
            }
        },
        {
            dataField: 'declineReason',
            text: 'Decline Reason'
        },
        {
            dataField: "orderProducts",
            text: 'Order Products',
            formatter: (col, row) => {
                return (
                    <span className="v-al-middle" style={{cursor: "pointer"}} title="View" onClick={() => Router.push("/orders/products/"+ row.id)}>
                        <FontAwesomeIcon icon={faEye} size="lg" />
                    </span>
                )
            }
        }
    ];

    return <CustomTable columns={columns} ajaxUrl={`${getAllOrdersWithCustomParamsFilter}?orderStatus=DECLINED`} dataName="orders" />;
}

export default class ViewAll extends Component {
  render() {
    return(
        <AppLayout pageName="View All Declined Orders">
            <Container as="div" align="center">
                <h6 style={{color: "#e84e4e"}}>Please scroll this table to the right to view more</h6>
            </Container>
            <Row as="div">
                <TableWrapper />
            </Row>
            <CustomModal />
        </AppLayout>
    );
  }
}