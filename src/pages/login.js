import {useState, useContext, useEffect} from 'react';
import Router from 'next/router';
import {Col, Container, Form, Row, Button} from 'react-bootstrap';
import styles from '../styles/login.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import postData from "../networking/send-post-request";
import getData from "../networking/send-get-request";
import {storeUserToken, logout, getUserToken} from '../components/host-master';
import {loginUrl, getAppDetailsUrl} from "../networking/external-url";
import {showAlert} from '../components/alerter';
import { AppContext } from '../providers/app-provider';
import Spinner from '../components/spinner';

const Login = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [appLogo, setAppLogo] = useState("/static/images/logo.png");
    const [state, setState] = useState({
        emailAddress: "",
        password: "",
        rememberMe: false,
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

    const handleCheckboxChange = (e) => {
        setState({...state, rememberMe: e.target.checked});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let loginResponse = await postData(loginUrl, state);
        if(loginResponse) {
            if(loginResponse.responseCode == 99) {
                if(state.rememberMe) storeUserToken(loginResponse.token);
                else storeUserToken(loginResponse.token, true);
                await Router.replace("/");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", "Invalid username or password");
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const forgotPassword = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        await Router.push("/forgot-password");
        toggleSpinner("hide");
    }

    const signUp = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        await Router.push("/sign-up");
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
                        User Login
                    </Row>
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="emailAddress" onChange={(e) => handleChange(e)} required />
                            {/* <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text> */}
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} required minLength="8" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember Me" onChange={(e) => handleCheckboxChange(e)} />
                        </Form.Group>
                        <Row align="center" className={styles.h4} as="div">
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </Row>
                        <Row align="center" className={styles.h4} as="div">
                            <a href="#" onClick={(e) => {forgotPassword(e);}}><FontAwesomeIcon icon={faLock} size="sm" /> Forgot Password?</a>
                        </Row>
                        <Row align="center" className={styles.h4} as="div">
                            <a href="#" onClick={(e) => {signUp(e);}}>Create new account</a>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Spinner />
        </Container>
    );
}

export default Login;