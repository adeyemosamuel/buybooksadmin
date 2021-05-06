import {useState, useContext} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../networking/send-post-request";
import {createProductLanguageUrl} from "../../networking/external-url";
import {showAlert} from '../../components/alerter';
import {AppContext} from '../../providers/app-provider';
import Router from 'next/router';


const CreateProductLanguage = (props) => {
    const {toggleSpinner, setActive} = useContext(AppContext) || {};

    const [state, setState] = useState({
        name: ""
    });

    const handleChange = (e) => {
        setState({[e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let createProductLanguageResponse = await postData(createProductLanguageUrl, state);
        if(createProductLanguageResponse) {
            if(createProductLanguageResponse.responseCode == 99) {
                showAlert("success", "New product language created successfully");
                await Router.push("/products/view-product-languages");
                setActive({id: 6, subMenuId: 3});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", createProductLanguageResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    return(
        <AppLayout pageName="Create Product Language">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Product-Language Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Create
                            </Button>

                            <Button variant="danger" type="reset" className="btn-reset">
                                Clear
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default CreateProductLanguage;