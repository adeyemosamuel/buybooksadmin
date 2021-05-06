import React, {Component, useContext, useState} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faEye} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomModal from '../../components/custom-modal';
import {AppContext} from '../../providers/app-provider';
import CustomTable from '../../components/custom-table';
import { getAllProductsWithCustomParamsUrl, getAllProductImagesUrl, deleteProductImageUrl } from '../../networking/external-url';
import getData from '../../networking/send-get-request';
import { showAlert, showAlertWithCallBack } from '../../components/alerter';

const TableWrapper = () => {
    const {activateModal, toggleSpinner} = useContext(AppContext) || {};

    const viewImages = async (productId) => {
        toggleSpinner("show");
        let data = [];
        const productImagesResponse = await getData(getAllProductImagesUrl + productId);
        if(productImagesResponse) {
            if(productImagesResponse.responseCode == 79) data = [];
            else data = productImagesResponse.responseData;
        }else data = [];
        const body = <Row className="mt-10" as="div">
                        {data.length > 0 ? data.map(productImage => {
                            return(
                                <Col md="3" key={productImage.id}>
                                    <div className="image-area">
                                        <img className="image-responsive" src={productImage.imageUrl} alt="Product Image" />
                                    </div>
                                </Col>
                            )
                        }) :    <Col md="12">
                                    <div style={{textAlign: "center"}}>
                                        <span>No data available</span>
                                    </div>
                                </Col>}
                    </Row>
        toggleSpinner("hide");
        activateModal({show: true, headerTitle: "Product Images", body: body});
    }
    
    const editButton = (cell, row) => {
        return (
            <div>
                <Button variant="warning" title="Edit" className="btn-table" onClick={() => Router.push("/products/edit/"+ row.id)}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>                   
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
            text: 'Name',
            sort: true
        },, 
        {
            dataField: 'author',
            text: 'Author',
            sort: true
        },
        {
            dataField: 'price',
            text: 'Price',
            sort: true
        },
        {
            dataField: 'quantityAvailable',
            text: 'Quantity Available',
            sort: true
        },
        {
            dataField: 'subCategory.name',
            text: 'Sub-Category'
        },
        {
            dataField: 'brand.name',
            text: 'Brand'
        },
        {
            dataField: "images",
            text: 'Images',
            formatter: (col, row) => {
                return (
                    <span className="v-al-middle" title="View" style={{cursor: "pointer"}} onClick={() => viewImages(row.id)}>
                        <FontAwesomeIcon icon={faEye} size="lg" />
                    </span>
                )
            }
        },
        {
            dataField: "action",
            text: 'Action',
            formatter: editButton
        }
    ];

    return <CustomTable columns={columns} ajaxUrl={getAllProductsWithCustomParamsUrl} dataName="products" />;
}

export default class ViewAll extends Component {
  render() {
    return(
      <AppLayout pageName="View All Products">
        <Row as="div">
            <TableWrapper />
        </Row>
        <CustomModal />
      </AppLayout>
    );
  }
}