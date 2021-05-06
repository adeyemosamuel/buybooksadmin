import {useState, useContext, useEffect} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import getData from "../../networking/send-get-request";
import postData from "../../networking/send-post-request";
import {getAdminCreationPropertiesUrl, userRegistrationUrl} from "../../networking/external-url";
import {showAlert} from '../../components/alerter';
import {AppContext} from '../../providers/app-provider';
import Router from 'next/router';

const Create = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        securityKey: "",
        password: "",
        confirmPassword: "",
        role: "ADMIN",
        refresh: false
    });

    useEffect(() => {
        getAdminCreationProperties();
    }, [state.refresh]);

    const getAdminCreationProperties = () => {
        toggleSpinner("show");
        getData(getAdminCreationPropertiesUrl)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                setState({
                    ...state,
                    securityKey: data.responseData.secretKey, 
                    password: data.responseData.defaultPassword, 
                    confirmPassword: data.responseData.defaultPassword
                });
                toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch admin creation properties");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch admin creation properties");
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
        let userRegistrationResponse = await postData(userRegistrationUrl, state);
        if(userRegistrationResponse) {
            if(userRegistrationResponse.responseCode == 99) {
                showAlert("success", "New user created successfully");
                await Router.push("/users/view-all");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", userRegistrationResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    return(
        <AppLayout pageName="Create User">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name="emailAddress" onChange={(e) => handleChange(e)} required />
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

export default Create;