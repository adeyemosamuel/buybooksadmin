import React, {Component}from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Row, Form, Button} from 'react-bootstrap';

export default class UpdateOrderStatus extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    async submit(e) {
        e.preventDefault();
        // Call backend here...
    }

    render() {
        return(
            <AppLayout pageName="Update Order Status">
                <Row as="div">
                    <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                        <Form action="#" onSubmit={this.submit.bind(this)}>
                            <Form.Group >
                                <Form.Label>Delivery Status</Form.Label>
                                <Form.Control required as="select">
                                    <option value="">- select one -</option>
                                    <option value="Partially Delivered">Partially Delivered</option>
                                    <option value="Delivered">Delivered</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group >
                                <Button variant="warning" type="submit">
                                    Update
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
}