import {useState, useContext, useEffect} from 'react';
import Router from 'next/router';
import {Col, Container, Form, Row, Button} from 'react-bootstrap';
import styles from '../styles/register.module.css';
import postData from "../networking/send-post-request";
import getData from "../networking/send-get-request";
import {userRegistrationUrl, getAppDetailsUrl} from "../networking/external-url";
import {showAlert, showAlertWithCallBack} from '../components/alerter';
import { AppContext } from '../providers/app-provider';
import Spinner from '../components/spinner';
import {logout, getUserToken} from '../components/host-master';

const SignUp = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [appLogo, setAppLogo] = useState("/static/images/logo.png");
    const [state, setState] = useState({
        securityKey: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        emailAddress: "",
        role: "ADMIN"
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
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let adminRegistrationResponse = await postData(userRegistrationUrl, state);
        if(adminRegistrationResponse) {
            if(adminRegistrationResponse.responseCode == 99) {
                toggleSpinner("hide");
                showAlertWithCallBack("success", "Account created successfully. Kindly login", () => {backToLogin();});
            }else {
                toggleSpinner("hide");
                showAlert("error", adminRegistrationResponse.errorMessage);
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
            <Row className={styles.row} as="div">
                <Col lg="7" md="8" sm="12" xs="12" className={`mr-auto ml-auto ${styles.col_bordered}`}>
                    <Row className={styles.brand} as="div">
                        <img src={appLogo} className={styles.brand_image} alt="Logo" itemProp="logo" />
                    </Row>
                    <Row align="center" className={styles.h4} as="h4">
                        Create Account
                    </Row>
                    <Form action="#" method="post" onSubmit={(e) => submit(e)} className={styles.form}>
                        <Form.Group >
                            <Form.Label>Security Key</Form.Label>
                            <Form.Control type="password" placeholder="Enter app security key" name="securityKey" onChange={(e) => handleChange(e)} required />
                        </Form.Group>
                        
                        <Row className={styles.row} as="div">
                            <Col md="6" className={`${styles.col_md_6} ${styles.p_r_10}`}>
                                <Form.Group >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" name="firstName" onChange={(e) => handleChange(e)} required />
                                </Form.Group>
                            </Col>
                            <Col md="6" className={styles.col_md_6}>
                                <Form.Group >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" name="lastName" onChange={(e) => handleChange(e)} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group >
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="emailAddress" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Row className={styles.row} as="div">
                            <Col md="6" className={`${styles.col_md_6} ${styles.p_r_10}`}>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} required minLength="8" />
                                </Form.Group>
                            </Col>
                            <Col md="6" className={styles.col_md_6}>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm your Password" name="confirmPassword" onChange={(e) => handleChange(e)} required minLength="8" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row align="center" className={styles.h4} as="div">
                            <Button variant="success" type="submit">
                                Sign-up
                            </Button>
                        </Row>
                        <Row align="center" className={styles.h4} as="div">
                            <a href="#" onClick={(e) => {backToLogin(e);}}>Back to login</a>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Spinner />
        </Container>
    );
}

export default SignUp;