import React, {Component} from 'react';
import {Col} from 'react-bootstrap';

export default class Footer extends Component {
    render() {
        return(
            <Col md="12" className="text-center footer" as="div">
                <footer>Copyright © 2020, Masterstroke E-novate</footer>
            </Col>
            
        )
    }
}