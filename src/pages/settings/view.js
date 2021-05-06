import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../providers/app-provider';
import postData from '../../networking/send-post-request';
import {modifyAppDetailsUrl} from '../../networking/external-url';
import { showAlert, showAlertWithCallBack } from '../../components/alerter';
import Router from 'next/router';
import { faBlog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const View = () => {
    const {toggleSpinner, appLogo, phoneNumbers, emailAddresses, address, displayBrands, primaryColor, secondaryColor, freeShippingAmount, freeReturnDays} = useContext(AppContext) || {};
    const [hideLogoPane, setHideLogoPane] = useState(true);
    const [disableContactDetailsPane, setDisableContactDetailsPane] = useState(true);
    const [disableSiteContentPane, setDisableSiteContentPane] = useState(true);
    const [state, setState] = useState({
        logo: null,
        phoneNumbers: "",
        emailAddresses: "",
        address: "",
        displayBrands: "",
        primaryColor: "",
        secondaryColor: "",
        freeShippingAmount: "",
        freeReturnDays: ""
    });

    useEffect(() => {
        if(address)
            setState({
                logo: null,
                phoneNumbers: phoneNumbers,
                emailAddresses: emailAddresses,
                address: address,
                displayBrands: displayBrands,
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
                freeShippingAmount: freeShippingAmount,
                freeReturnDays: freeReturnDays
            });
    }, []);

    const submit = async (e, type) => {
        e.preventDefault();
        toggleSpinner("show");
        let modifyAppDetailsResponse = await postData(modifyAppDetailsUrl, state);
        if(modifyAppDetailsResponse) {
            if(modifyAppDetailsResponse.responseCode == 99) {
                showAlertWithCallBack("success", `App ${type} modified successfully`, () => {
                    if(type == "logo") {
                        setHideLogoPane(true);
                        Router.reload();
                    }else {
                        setDisableContactDetailsPane(true);
                        setDisableSiteContentPane(true);
                    }
                });
            }else showAlert("error", `Oops! you are unable to modify app ${type} at this time. Please try again later. Possible solution: Check your internet connection`);
        }
        toggleSpinner("hide");
    }

    const toggleLogoPane = (action) => {
        if(action == "show") setHideLogoPane(false);
        else setHideLogoPane(true);
    }

    const toggleContactDetailsPane = (action) => {
        if(action == "show") setDisableContactDetailsPane(false);
        else setDisableContactDetailsPane(true);
    }

    const toggleSiteContentPane = (action) => {
        if(action == "show") setDisableSiteContentPane(false);
        else setDisableSiteContentPane(true);
    }

    const handleStateChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const handlePhotoChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            let fileReader = new window.FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = (e) => setState({...state, logo: e.target.result});
        }
    }

    const manageBlog = async (e) => {
        e.preventDefault(); 
        toggleSpinner("show"); 
        await Router.push("/settings/blog/manage");
        toggleSpinner("hide");
    }

    const toggleBrands = (e) => {
        setState({displayBrands: e.target.checked});
    }
    
    return(
        <AppLayout pageName="Settings">
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" onSubmit={(e) => submit(e, "logo")}>
                        
                        <Form.Group >
                            <h5>
                                App Logo 
                                <a className="edit-right" hidden={!hideLogoPane} href="#" onClick={() => toggleLogoPane("show")}>Edit</a>
                                <a className="edit-right" hidden={hideLogoPane} href="#" onClick={() => toggleLogoPane("hide")}>Hide</a>
                            </h5>
                            <Form.Label>Logo</Form.Label>
                            <div className="p-15-nl-nr">
                                <img src={appLogo} alt="Logo" className="image-responsive" itemProp="logo" />
                            </div>
                            <Form.File accept="image/*" required hidden={hideLogoPane} onChange={(e) => handlePhotoChange(e)} />
                        </Form.Group>

                        <Form.Group hidden={hideLogoPane}>
                            <Button variant="success" type="submit">
                                Save Changes
                            </Button>
                        </Form.Group>
                    </Form>

                    <Form action="#" onSubmit={(e) => submit(e, "contact details")}>
                        <Form.Group >
                            <h5>
                                Contact Details 
                                <a className="edit-right" hidden={!disableContactDetailsPane} href="#" onClick={() => toggleContactDetailsPane("show")}>Edit</a>
                                <a className="edit-right" hidden={disableContactDetailsPane} href="#" onClick={() => toggleContactDetailsPane("hide")}>Hide</a>
                            </h5>

                            <Form.Label>Phone Numbers</Form.Label>
                            <Form.Control type="text" placeholder="e.g, +2348099887655, +2348050995018" value={state.phoneNumbers} disabled={disableContactDetailsPane} name="phoneNumbers" onChange={(e) => handleStateChange(e)} required />

                            <Form.Label>Email Addresses</Form.Label>
                            <Form.Control type="text" placeholder="e.g, support@bbip.com, customercare@bbip.com" value={state.emailAddresses} disabled={disableContactDetailsPane} name="emailAddresses" onChange={(e) => handleStateChange(e)} required />

                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="e.g, 112 GRA layout portharcourt, Nigeria" value={state.address} disabled={disableContactDetailsPane} name="address" onChange={(e) => handleStateChange(e)} required />
                        </Form.Group>

                        <Form.Group  hidden={disableContactDetailsPane}>
                            <Button variant="success" type="submit">
                                Save Changes
                            </Button>
                        </Form.Group>
                    </Form>

                    <Form action="#" onSubmit={(e) => submit(e, "content")}>
                        <Form.Group >
                            <h5>
                                Site Content 
                                <a className="edit-right" hidden={!disableSiteContentPane} href="#" onClick={() => toggleSiteContentPane("show")}>Edit</a>
                                <a className="edit-right" hidden={disableSiteContentPane} href="#" onClick={() => toggleSiteContentPane("hide")}>Hide</a>
                            </h5>

                            <Form.Check type="switch" id="custom-switch" label="Display Brands" disabled={disableSiteContentPane} checked={state.displayBrands} onChange={(e) => toggleBrands(e)} />

                            <Form.Label>Primary Color</Form.Label>
                            <Form.Control type="text" placeholder="e.g, #00000, #fafafa, #ffffff" value={state.primaryColor} disabled={disableSiteContentPane} name="primaryColor" onChange={(e) => handleStateChange(e)} required />

                            <Form.Label>Secondary Color</Form.Label>
                            <Form.Control type="text" placeholder="e.g, #00000, #fafafa, #ffffff" value={state.secondaryColor} disabled={disableSiteContentPane} name="secondaryColor" onChange={(e) => handleStateChange(e)} required />

                            <Form.Label>Free Shipping Amount</Form.Label>
                            <Form.Control type="number" placeholder="e.g, 100, 200, 300" value={state.freeShippingAmount} disabled={disableSiteContentPane} name="freeShippingAmount" onChange={(e) => handleStateChange(e)} required />

                            <Form.Label>Free Return Days</Form.Label>
                            <Form.Control type="number" placeholder="e.g, 7, 30, 100" value={state.freeReturnDays} disabled={disableSiteContentPane} name="freeReturnDays" onChange={(e) => handleStateChange(e)} required />
                        </Form.Group>
                        <Form.Group  hidden={disableSiteContentPane}>
                            <Button variant="success" type="submit">
                                Save Changes
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <hr/>
                </Col>
            </Row>
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <a className="edit-right" href="#" onClick={(e) => manageBlog(e)}><FontAwesomeIcon icon={faBlog} size="2x" className="icon-info" />&nbsp;Manage BBIP Blog</a>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default View;