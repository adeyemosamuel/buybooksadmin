import {useState, useContext, useEffect} from 'react';
import Router from 'next/router';
import {Col, Container, Form, Row, Button} from 'react-bootstrap';
import styles from '../styles/login.module.css';
import postData from "../networking/send-post-request";
import getData from "../networking/send-get-request";
import {forgotPasswordUrl, getAppDetailsUrl} from "../networking/external-url";
import {showAlert} from '../components/alerter';
import { AppContext } from '../providers/app-provider';
import Spinner from '../components/spinner';
import {logout, getUserToken} from '../components/host-master';

const ForgotPassword = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [appLogo, setAppLogo] = useState("/static/images/logo.png");
    const [state, setState] = useState({
        emailAddress: ""
    });

    useEffect(() => {
        if(getUserToken()) logout();
        getAppDetails();
    }, []);

    const getAppDetails = async () => {
        let appDetailsResponse = await getData(getAppDetailsUrl);
        if(appDetailsResponse) {
            if(appDetailsResponse.responseCode == 99) {
                if(appDetailsResponse.responseData.appLogoUrl)
                    setAppLogo(appDetailsResponse.responseData.appLogoUrl);
            }
        }
    }

    const handleChange = (e) => {
        setState({[e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let forgotPasswordResponse = await postData(forgotPasswordUrl, state);
        if(forgotPasswordResponse) {
            if(forgotPasswordResponse.responseCode == 99) {
                toggleSpinner("hide");
                showAlert("success", forgotPasswordResponse.message);
            }else {
                toggleSpinner("hide");
                showAlert("error", forgotPasswordResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const backToLogin = async (e) => {
        if(e) e.preventDefault();
        toggleSpinner("show");
        await Router.push("/login");
        toggleSpinner("hide");
    }

    return(
        <Container>
            <Row as="div">
                <Col lg="5" md="6" sm="12" xs="12" className={`mr-auto ml-auto ${styles.col_bordered}`}>
                    <Row className={styles.brand} as="div">
                        <img src={appLogo} className={styles.brand_image} alt="Logo" itemProp="logo" />
                    </Row>
                    <Row align="center" className={styles.h4} as="h4">
                        Forgot Password
                    </Row>
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="emailAddress" onChange={(e) => handleChange(e)} required />
                        </Form.Group>
                        
                        <Row align="center" className={styles.h4} as="div">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Row>
                        <Row align="center" className={styles.h4} as="div">
                            <a href="#" onClick={(e) => backToLogin(e)}>Back to login</a>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Spinner />
        </Container>
    );
}

export default ForgotPassword;