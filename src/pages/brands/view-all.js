import React, {Component, useContext} from 'react';
import {Row, Button} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../components/custom-table';
import { getBrandsWithCustomParamsUrl } from '../../networking/external-url';
import { AppContext } from '../../providers/app-provider';


const editButton = (cell, row) => {
    return (
        <div>
            <Button variant="warning" title="Edit" className="btn-table" onClick={() => Router.push(`/brands/edit/${row.id}`)}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>                   
        </div>
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
        text: 'Brand Name',
    },
    {
        dataField: 'category.name',
        text: 'Category Name',
    },
    {
        dataField: "action",
        text: 'Action',
        formatter: editButton
    }
  ];
  
  const ViewAllDeletedButton = () => {
    const {toggleSpinner} = useContext(AppContext) || {};
  
    const goToDeleted = async (e) => {
      e.preventDefault();
      toggleSpinner("show");
      await Router.push("/brands/view-all-deleted");
      toggleSpinner("hide");
    }
  
    return(
      <a href="#" className="view-deleted-btn" onClick={(e) => goToDeleted(e)}>
          <FontAwesomeIcon icon={faTrash} size="sm"/>&nbsp;&nbsp;VIEW DELETED BRANDS
      </a>
    );
  }

export default class ViewAll extends Component {
  render() {
    return(
      <AppLayout pageName="View All Brands">
        <Row as="div" className="view-deleted-row">
          <ViewAllDeletedButton />
        </Row>
        <Row as="div">
        <CustomTable columns={columns} ajaxUrl={getBrandsWithCustomParamsUrl} dataName="brands" />
        </Row>
      </AppLayout>
    );
  }
}