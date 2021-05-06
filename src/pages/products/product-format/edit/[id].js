import React, {Component, useEffect, useContext, useState} from 'react';
import AppLayout from '../../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../../networking/send-post-request";
import getData from "../../../../networking/send-get-request";
import {getProductFormatUrl, editProductFormatUrl, deleteProductFormatUrl} from "../../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../../components/alerter';
import {AppContext} from '../../../../providers/app-provider';
import Router from 'next/router';

export default class EditProductFormat extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    render() {
        return(
            <Edit id={this.props.id}/>
        );
    }
}

const Edit = (props) => {
    const {toggleSpinner, setActive} = useContext(AppContext) || {};

    const [state, setState] = useState({
        productFormatId: props.id,
        name: ""
    });

    useEffect(() => {
        getProductFormat();
    }, [state.productFormatId]);

    const getProductFormat = () => {
        toggleSpinner("show");
        getData(getProductFormatUrl + state.productFormatId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({...state, name: data.responseData.name});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch product format");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch product format");
                toggleSpinner("hide");
            }
        });
    }

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let editProductFormatResponse = await postData(editProductFormatUrl, state);
        if(editProductFormatResponse) {
            if(editProductFormatResponse.responseCode == 99) {
                showAlert("success", "Product format edited successfully");
                await Router.push("/products/view-product-formats");
                setActive({id: 6, subMenuId: 5});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editProductFormatResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const deleteProductFormat = (e) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", "This product format would be deleted!", () => performDelete());
    }

    const performDelete = async () => {
        toggleSpinner("show");
        let deleteProductFormatResponse = await getData(deleteProductFormatUrl + state.productFormatId);
        if(deleteProductFormatResponse) {
            if(deleteProductFormatResponse.responseCode == 99) {
                showAlert("success", "Product format deleted successfully");
                await Router.push("/products/view-product-formats");
                setActive({id: 6, subMenuId: 5});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", deleteProductFormatResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops! This product format cannot be deleted at the moment, try again later");
        }
    }

    return(
        <AppLayout pageName="Edit Product Format">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Product-Format Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                            <Button variant="danger" type="button" className="btn-reset" onClick={(e) => deleteProductFormat(e)}>
                                Delete Product Format
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}