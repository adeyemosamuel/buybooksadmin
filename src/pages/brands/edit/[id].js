import React, {Component, useEffect, useContext, useState} from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../networking/send-post-request";
import getData from "../../../networking/send-get-request";
import {getBrandUrl, editBrandUrl, deleteBrandUrl} from "../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../components/alerter';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';

export default class EditBrand extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    render() {
        return(
            <Edit id={this.props.id} />
        );
    }
}

const Edit = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [state, setState] = useState({
        brandId: props.id,
        name: ""
    });

    useEffect(() => {
        getBrand();
    }, [state.brandId]);

    const getBrand = () => {
        toggleSpinner("show");
        getData(getBrandUrl + state.brandId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({...state, name: data.responseData.name});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch brand");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch brand");
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
        let editBrandResponse = await postData(editBrandUrl, state);
        if(editBrandResponse) {
            if(editBrandResponse.responseCode == 99) {
                showAlert("success", "Brand edited successfully");
                await Router.push("/brands/view-all");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editBrandResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const deleteBrand = (e) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", "This brand would be deleted!", () => performDelete());
    }

    const performDelete = () => {
        toggleSpinner("show");
        getData(deleteBrandUrl + state.brandId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    showAlert("success", "Brand deleted successfully");
                    Router.push("/brands/view-all");
                    toggleSpinner("hide");
                }else {
                    toggleSpinner("hide");
                    showAlert("error", data.errorMessage);
                }
            }else {
                toggleSpinner("hide");
                showAlert("error", "Oops! This brand cannot be deleted at the moment, try again later");
            }
        });
    }

    return(
        <AppLayout pageName="Edit Brand">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Brand Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                            <Button variant="danger" type="button" className="btn-reset" onClick={(e) => deleteBrand(e)}>
                                Delete Brand
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}