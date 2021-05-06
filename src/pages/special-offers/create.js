import React, {Component} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    async submit(e) {
        e.preventDefault();
    }

    render() {
        return(
            <AppLayout pageName="Create Special Offer">
                <Row as="div">
                    <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                        <Form action="#" onSubmit={this.submit.bind(this)}>
                            <Form.Group >
                                <Form.Label>Offer Name</Form.Label>
                                <Form.Control type="text" required />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Registration Start Date</Form.Label>
                                <Form.Control type="date" required />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Registration End Date</Form.Label>
                                <Form.Control type="date" required />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Offer Start Date</Form.Label>
                                <Form.Control type="date" required />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Offer Expiry Date</Form.Label>
                                <Form.Control type="date" required />
                            </Form.Group>

                            <Form.Group >
                                <Form.Label>Offer Banner Images</Form.Label>
                                <Form.File accept="image/*" multiple required />
                                <Form.Text className="text-muted">
                                    You can select more than one image by pressing ctrl while clicking on an image. Thats is, ctrl + click
                                </Form.Text>
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
}