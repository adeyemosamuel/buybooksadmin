import React, {Component, useEffect, useContext, useState} from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../networking/send-post-request";
import getData from "../../../networking/send-get-request";
import {getCategoryUrl, editCategoryUrl, deleteCategoryUrl} from "../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../components/alerter';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';

export default class EditCategory extends Component {
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
    const {toggleSpinner} = useContext(AppContext) || {};

    const [state, setState] = useState({
        categoryId: props.id,
        name: ""
    });

    useEffect(() => {
        getCategory();
    }, [state.categoryId]);

    const getCategory = () => {
        toggleSpinner("show");
        getData(getCategoryUrl + state.categoryId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({...state, name: data.responseData.name});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch category");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch category");
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
        let editCategoryResponse = await postData(editCategoryUrl, state);
        if(editCategoryResponse) {
            if(editCategoryResponse.responseCode == 99) {
                showAlert("success", "Category edited successfully");
                await Router.push("/categories/view-all");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editCategoryResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const deleteCategory = (e) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", "This category would be deleted!", () => performDelete());
    }

    const performDelete = () => {
        toggleSpinner("show");
        getData(deleteCategoryUrl + state.categoryId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    showAlert("success", "Category deleted successfully");
                    Router.push("/categories/view-all");
                    toggleSpinner("hide");
                }else {
                    toggleSpinner("hide");
                    showAlert("error", data.errorMessage);
                }
            }else {
                toggleSpinner("hide");
                showAlert("error", "Oops! This category cannot be deleted at the moment, try again later");
            }
        });
    }

    return(
        <AppLayout pageName="Edit Category">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                            <Button variant="danger" type="button" className="btn-reset" onClick={(e) => deleteCategory(e)}>
                                Delete Category
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}