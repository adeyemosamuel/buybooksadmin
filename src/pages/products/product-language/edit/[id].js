import React, {Component, useEffect, useContext, useState} from 'react';
import AppLayout from '../../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../../networking/send-post-request";
import getData from "../../../../networking/send-get-request";
import {getProductLanguageUrl, editProductLanguageUrl, deleteProductLanguageUrl} from "../../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../../components/alerter';
import {AppContext} from '../../../../providers/app-provider';
import Router from 'next/router';

export default class EditProductLanguage extends Component {
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
        productLanguageId: props.id,
        name: ""
    });

    useEffect(() => {
        getProductLanguage();
    }, [state.productLanguageId]);

    const getProductLanguage = () => {
        toggleSpinner("show");
        getData(getProductLanguageUrl + state.productLanguageId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({...state, name: data.responseData.name});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch product language");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch product language");
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
        let editProductLanguageResponse = await postData(editProductLanguageUrl, state);
        if(editProductLanguageResponse) {
            if(editProductLanguageResponse.responseCode == 99) {
                showAlert("success", "Product language edited successfully");
                await Router.push("/products/view-product-languages");
                setActive({id: 6, subMenuId: 3});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editProductLanguageResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const deleteProductLanguage = (e) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", "This product language would be deleted!", () => performDelete());
    }

    const performDelete = async () => {
        toggleSpinner("show");
        let deleteProductLanguageResponse = await getData(deleteProductLanguageUrl + state.productLanguageId);
        if(deleteProductLanguageResponse) {
            if(deleteProductLanguageResponse.responseCode == 99) {
                showAlert("success", "Product language deleted successfully");
                await Router.push("/products/view-product-languages");
                setActive({id: 6, subMenuId: 3});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", deleteProductLanguageResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops! This product language cannot be deleted at the moment, try again later");
        }
    }

    return(
        <AppLayout pageName="Edit Product Language">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Product-Language Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                            <Button variant="danger" type="button" className="btn-reset" onClick={(e) => deleteProductLanguage(e)}>
                                Delete Product Language
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}