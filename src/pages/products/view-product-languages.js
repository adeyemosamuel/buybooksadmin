import React, {Component, useState, useContext, useEffect} from 'react';
import {Row, Button} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../components/custom-table';
import { getAllProductLanguagesUrl } from '../../networking/external-url';
import { AppContext } from '../../providers/app-provider';
import getData from '../../networking/send-get-request';


const editButton = (cell, row) => {
  return (
      <div>
          <Button variant="warning" title="Edit" className="btn-table" onClick={() => Router.push(`/products/product-language/edit/${row.id}`)}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>                   
      </div>
  );
}

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    }, 
    {
        dataField: 'name',
        text: 'Product-Language Name',
        sort: true
    },
    {
        dataField: "action",
        text: 'Action',
        formatter: editButton
    }
];

export default class ViewProductLanguages extends Component {
  render() {
    return(
      <AppLayout pageName="View Product Languages">
        <Row as="div">
            <ClientSideDT />
        </Row>
      </AppLayout>
    );
  }
}

const ClientSideDT = () => {
    const [state, setState] = useState({
        productLanguages: []
    });

    const {toggleSpinner} = useContext(AppContext) || {};

    useEffect(() => {
        toggleSpinner("show");
        getData(getAllProductLanguagesUrl)
        .then((data) => {
            if(data) {
                toggleSpinner("hide");
                if(data.responseCode == 99) {
                    setState({productLanguages: data.responseData});
                }else{
                    console.log("Unable to fetch product languages");
                }
            }else {
                toggleSpinner("hide");
                console.log("Unable to fetch product languages");
            }
        });
    }, []);

    return(
        <CustomTable data={state.productLanguages} columns={columns} />
    );
}