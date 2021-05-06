import {useState, useContext} from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../../networking/send-post-request";
import {addDeliveryMethodUrl} from "../../../networking/external-url";
import {showAlert} from '../../../components/alerter';
import {AppContext} from '../../../providers/app-provider';
import Router from 'next/router';

const Create = () => {
    const {toggleSpinner, setActive} = useContext(AppContext) || {};

    const [state, setState] = useState({
        name: "",
        start: "",
        end: "",
        duration: "",
        price: ""
    });

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let addDeliveryMethodResponse = await postData(addDeliveryMethodUrl, state);
        if(addDeliveryMethodResponse) {
            if(addDeliveryMethodResponse.responseCode == 99) {
                showAlert("success", "New delivery method created successfully");
                await Router.push("/delivery/methods/view-all");
                setActive({id: 9, subMenuId: 1});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", addDeliveryMethodResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    return(
        <AppLayout pageName="Create Delivery Method">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Delivery Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Start Duration</Form.Label>
                            <Form.Control type="number" min="1" name="start" onChange={(e) => handleChange(e)} required />
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "Start Duration" would be: 3
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>End Duration</Form.Label>
                            <Form.Control type="number" min="1" name="end" onChange={(e) => handleChange(e)} required />
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "End Duration" would be: 5
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Duration</Form.Label>
                            <Form.Control name="duration" onChange={(e) => handleChange(e)} required as="select">
                                <option value="">- select one -</option>
                                <option value="Days">Days</option>
                                <option value="Weeks">Weeks</option>
                                <option value="Months">Months</option>
                                <option value="Years">Years</option>
                            </Form.Control>
                            <Form.Text className="text-muted">
                                For example:- For a duration of 3-5 days, "Duration" would be: days
                            </Form.Text>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Delivery Cost/Price (&#8358;)</Form.Label>
                            <Form.Control type="number" min="0" name="price" onChange={(e) => handleChange(e)} required />
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