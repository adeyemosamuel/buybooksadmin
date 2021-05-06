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
    const actionButtons = (cell, row) => {
        return (
            <div>
                <Button variant="success" title="Approve" className="btn-table" style={{marginBottom: 5}} onClick={() => Router.push({pathname: "/users/edit/"+ row.id})}><FontAwesomeIcon icon={faCheck} size="sm" /></Button>
                <Button variant="danger" title="Decline" className="btn-table" onClick={() => Router.push({pathname: "/users/edit/"+ row.id})}><FontAwesomeIcon icon={faBan} size="sm" /></Button>
            </div>
        )
    }

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
            dataField: "orderProducts",
            text: 'Order Products',
            formatter: (col, row) => {
                return (
                    <span className="v-al-middle" style={{cursor: "pointer"}} title="View" onClick={() => Router.push("/orders/products/"+ row.id)}>
                        <FontAwesomeIcon icon={faEye} size="lg" />
                    </span>
                )
            }
        },
        {
            dataField: "action",
            text: 'Action',
            formatter: actionButtons
        }
    ];

    return <CustomTable columns={columns} ajaxUrl={`${getAllOrdersWithCustomParamsFilter}?orderStatus=PENDING`} dataName="orders" />;
}

export default class ViewAll extends Component {
  render() {
    return(
        <AppLayout pageName="View All Pending Orders">
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