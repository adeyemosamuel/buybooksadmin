import React, {Component, useState, useContext, useEffect} from 'react';
import AppLayout from '../../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../../networking/send-post-request";
import getData from "../../../../networking/send-get-request";
import {getDeliveryMethodUrl, editDeliveryMethodUrl, setDeliveryMethodActiveUrl, setDeliveryMethodInactiveUrl} from "../../../../networking/external-url";
import {showAlert, showConfirmAlertWithCallBack} from '../../../../components/alerter';
import {AppContext} from '../../../../providers/app-provider';
import Router from 'next/router';

export default class EditDeliveryMethod extends Component {
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
        deliveryId: props.id,
        name: "",
        start: "",
        end: "",
        duration: "",
        price: "",
        isActive: false
    });

    useEffect(() => {
        getDeliveryMethod();
    }, [state.deliveryId]);

    const getDeliveryMethod = () => {
        toggleSpinner("show");
        getData(getDeliveryMethodUrl + state.deliveryId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    const {name, start, end, duration, price, isActive} = data.responseData;
                    setState({
                        ...state, 
                        name: name, 
                        start: start, 
                        end: end,
                        duration: duration, 
                        price: price, 
                        isActive: isActive
                    });
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch delivery method");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch delivery method");
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
        let editDeliveryMethodResponse = await postData(editDeliveryMethodUrl, state);
        if(editDeliveryMethodResponse) {
            if(editDeliveryMethodResponse.responseCode == 99) {
                showAlert("success", "Delivery method edited successfully");
                await Router.push("/delivery/methods/view-all");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editDeliveryMethodResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const performUserAction = (e, action) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", `This delivery method would be ${action}d!`, () => performAction(action));
    }

    const performAction = (action) => {
        toggleSpinner("show");
        
        let promise = action == "enable" ? 
        getData(setDeliveryMethodActiveUrl + state.deliveryId) : 
        getData(setDeliveryMethodInactiveUrl + state.deliveryId);

        promise
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    showAlert("success", `Delivery method ${action}d successfully`);
                    Router.push("/delivery/methods/view-all");
                    toggleSpinner("hide");
                }else {
                    toggleSpinner("hide");
                    showAlert("error", data.errorMessage);
                }
            }else {
                toggleSpinner("hide");
                showAlert("error", `Oops! This delivery method cannot be ${action}d at the moment, try again later`);
            }
        });
    }

    return(
        <AppLayout pageName="Edit Delivery Method">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" onSubmit={(e) => submit(e)}>
                    <Form.Group >
                            <Form.Label>Delivery Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Start Duration</Form.Label>
                            <Form.Control type="number" min="1" defaultValue={state.start} name="start" onChange={(e) => handleChange(e)} required />
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "Start Duration" would be: 3
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>End Duration</Form.Label>
                            <Form.Control type="number" min="1" defaultValue={state.end} name="end" onChange={(e) => handleChange(e)} required />
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "End Duration" would be: 5
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Duration</Form.Label>
                            <Form.Control value={state.duration} name="duration" onChange={(e) => handleChange(e)} required as="select">
                                <option value="">- select one -</option>
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "Duration" would be: days
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Delivery Cost/Price (&#8358;)</Form.Label>
                            <Form.Control type="number" min="0" defaultValue={state.price} name="price" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            &nbsp;&nbsp;
                            {
                                state.isActive ? 
                                    <Button variant="danger" type="button" className="btn-reset ml-0" onClick={(e) => performUserAction(e, "disable")}>
                                        Disable Delivery Method
                                    </Button>
                                : 
                                    <Button variant="success" type="button" className="btn-reset ml-0" onClick={(e) => performUserAction(e, "enable")}>
                                        Enable Delivery Method
                                    </Button>
                            }
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}