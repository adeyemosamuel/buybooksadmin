import React, {Component, useState, useContext, useEffect} from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import getData from "../../../networking/send-get-request";
import postData from "../../../networking/send-post-request";
import {getProfileUrl, disableUserUrl, enableUserUrl} from "../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../components/alerter';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';

export default class EditUsers extends Component {
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
        userId: props.id,
        firstName: "",
        lastName: "",
        emailAddress: "",
        isDisabled: false
    });

    useEffect(() => {
        getUser();
    }, [state.userId]);

    const getUser = () => {
        toggleSpinner("show");
        getData(getProfileUrl + state.userId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({
                        ...state, 
                        firstName: data.responseData.firstName, 
                        lastName: data.responseData.lastName, 
                        emailAddress: data.responseData.emailAddress,
                        isDisabled: data.responseData.isDisabled
                    });
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch user");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch user");
                toggleSpinner("hide");
            }
        });
    }

    const performUserAction = (e, action) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", `This user would be ${action}d!`, () => performAction(action));
    }

    const performAction = (action) => {
        toggleSpinner("show");
        
        let promise = action == "enable" ? 
        getData(enableUserUrl + state.userId) : 
        postData(disableUserUrl, {userId: state.userId, reason: "Admin action"});

        promise
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    showAlert("success", `User ${action}d successfully`);
                    Router.push("/users/view-all");
                    toggleSpinner("hide");
                }else {
                    toggleSpinner("hide");
                    showAlert("error", data.errorMessage);
                }
            }else {
                toggleSpinner("hide");
                showAlert("error", `Oops! This user cannot be ${action}d at the moment, try again later`);
            }
        });
    }

    return(
        <AppLayout pageName="Edit User">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post">
                        <Form.Group >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" required defaultValue={state.firstName} disabled />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" required defaultValue={state.lastName} disabled />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" required defaultValue={state.emailAddress} disabled />
                        </Form.Group>

                        <Form.Group >
                            {
                            state.isDisabled ? 
                                <Button variant="success" type="button" className="btn-reset ml-0" onClick={(e) => performUserAction(e, "enable")}>
                                    Enable User
                                </Button>: 
                                <Button variant="danger" type="button" className="btn-reset ml-0" onClick={(e) => performUserAction(e, "disable")}>
                                    Disable User
                                </Button>
                            }
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}