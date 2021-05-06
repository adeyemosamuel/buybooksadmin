import React, {Component, useState, useContext, useEffect} from 'react';
import {Row, Button} from 'react-bootstrap';
import AppLayout from '../../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faCheckCircle, faEdit} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../../components/custom-table';
import getData from '../../../networking/send-get-request';
import {getAllDeliveryMethodsUrl} from '../../../networking/external-url';
import { AppContext } from '../../../providers/app-provider';


const editButton = (cell, row) => {
    return (
        <div>
            <Button variant="warning" title="Edit" className="btn-table" onClick={() => Router.push("/delivery/methods/edit/"+ row.id)}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>                   
        </div>
    )
}

const deliveryStatus = (cell, row) => {
    if(row.active)
        return (
            <span title="Active">
                <FontAwesomeIcon icon={faCheckCircle} style={{color: "#28a745"}} size="2x" />
            </span>
        );
    else
        return (
            <span title="Inactive">
                <FontAwesomeIcon icon={faBan} style={{color: "#b21f2d"}} size="2x" />
            </span>
        );
}

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        hidden: true
    }, 
    {
        dataField: 'name',
        text: 'Delivery Name'
    },
    {
        dataField: 'deliveryTypeSummary',
        text: 'Delivery Duration'
    },
    {
        dataField: 'price',
        text: 'Delivery Cost/Price'
    },
    {
        dataField: 'active',
        text: 'Status',
        formatter: deliveryStatus
    },
    {
        dataField: "action",
        text: 'Action',
        formatter: editButton
    }
];

export default class ViewAll extends Component {
    render() {
        return(
        <AppLayout pageName="View All Delivery Methods">
            <Row as="div">
                <ClientSideDT />
            </Row>
        </AppLayout>
        );
    }
}

const ClientSideDT = () => {
    const [state, setState] = useState({
        deliveryMethods: []
    });

    const {toggleSpinner} = useContext(AppContext) || {};

    useEffect(() => {
        toggleSpinner("show");
        getData(getAllDeliveryMethodsUrl)
        .then((data) => {
            if(data) {
                toggleSpinner("hide");
                if(data.responseCode == 99) {
                    setState({deliveryMethods: data.responseData});
                }else{
                    console.log("Unable to fetch delivery methods");
                }
            }else {
                toggleSpinner("hide");
                console.log("Unable to fetch delivery methods");
            }
        });
    }, []);

    return(
        <CustomTable data={state.deliveryMethods} columns={columns} />
    );
}