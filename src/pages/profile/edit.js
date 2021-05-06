import {useState, useContext, useEffect} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import { AppContext } from '../../providers/app-provider';
import { showAlert, showAlertWithCallBack, showConfirmAlertWithCallBack } from '../../components/alerter';
import postData from '../../networking/send-post-request';
import Router from 'next/router';
import { editProfileUrl } from '../../networking/external-url';
import {fetchCurrentUser, logout} from '../../components/host-master';

const EditProfile = () => {
    const {currentUser, updateCu, toggleSpinner, setActive} = useContext(AppContext) || {currentUser: {}};

    const [state, setState] = useState({
        showPhotoPicker: false,
        firstName: null,
        lastName: null,
        emailAddress: null,
        phoneNumber: null,
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null
    });

    const handlePhotoChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            let fileReader = new window.FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = (e) => {
                showConfirmAlertWithCallBack("warning", "Profile photo would be uploaded now", () => uploadProfilePhoto(e.target.result));
            }
        }
    }

    const uploadProfilePhoto = async (profilePhoto) => {
        const data = {
            profilePhoto: profilePhoto
        }
        toggleSpinner("show");
        let photoUploadResponse = await postData(editProfileUrl, data);
        if(photoUploadResponse) {
            if(photoUploadResponse.responseCode == 99) {
                toggleSpinner("hide");
                showAlertWithCallBack("success", "Profile photo updated successfully", () => getUpdatedCu());
            }else {
                toggleSpinner("hide");
                showAlert("error", "Oops, profile photo cannot be uploaded at the moment. Possible solution: check your internet connection and retry later");
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const getUpdatedCu = () => {
        toggleSpinner("show");
        fetchCurrentUser().then(data => {
            if(data) {
                updateCu(data);
                setState({showPhotoPicker: false});
                toggleSpinner("hide");
            }else {
                console.log("An error occurred while tring to refresh current user details");
                toggleSpinner("hide");
                Router.reload();
            }
        });
    }

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }
    
    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        const data = state;
        delete data["oldPassword"];
        let emailEdited = false;
        if(data.emailAddress) emailEdited = true;
        let editProfileResponse = await postData(editProfileUrl, data);
        if(editProfileResponse) {
            if(editProfileResponse.responseCode == 99) {
                toggleSpinner("hide");
                if(!emailEdited)
                    showAlertWithCallBack("success", "Profile details updated successfully", () => getUpdatedCu());
                else
                    showAlertWithCallBack("success", "Profile details updated successfully. Email address change detected, kindly login again", () => backToLogin());
            }else {
                toggleSpinner("hide");
                showAlert("error", editProfileResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        const {oldPassword, newPassword, confirmNewPassword} = state;
        const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword

        }
        let changePasswordResponse = await postData(editProfileUrl, data);
        if(changePasswordResponse) {
            if(changePasswordResponse.responseCode == 99) {
                toggleSpinner("hide");
                showAlertWithCallBack("success", "Password changed successfully. Kindly login again", () => backToLogin());
            }else {
                toggleSpinner("hide");
                showAlert("error", changePasswordResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const backToLogin = async () => {
        toggleSpinner("show");
        logout();
        await Router.push("/login");
        toggleSpinner("hide");
        setActive({id: 1});
    }

    return(
        <AppLayout pageName="Edit Profile">
            <Row as="div">
                <Col md="12">
                    <h5>Profile Photo</h5>
                </Col>
            </Row>
            <Row className="profile-photo-row" as="div">
                <Col md="10" lg="5" sm="12" xs="12">
                    <img src={currentUser ? (currentUser.profilePhotoUrl || "https://dummyimage.com/600x400/000/fff") : "https://dummyimage.com/600x400/000/fff"} alt="Profile Photo" className="image-responsive p-photo-big" hidden={state.showPhotoPicker} />
                    <a className="edit-right" href="#" hidden={state.showPhotoPicker} onClick={() => setState({showPhotoPicker: true})}>Edit Profile Photo</a>
                    <a className="edit-right" href="#" hidden={!state.showPhotoPicker} onClick={() => setState({showPhotoPicker: false})}>Cancel</a>
                </Col>
            </Row>
            <Row className="pt-pb-10" as="div" hidden={!state.showPhotoPicker}>
                <Col md="5">
                    <Form.Control type="file" accept="image/*" name="profilePhoto" onChange={(e) => handlePhotoChange(e)} />
                </Col>
            </Row>
            <hr/>
            <Form action="#" onSubmit={(e) => submit(e)}>
                <Row as="div">
                    <Col md="12">
                        <h5>Personal Details</h5>
                    </Col>
                </Row>
                <Row className="pt-10" as="div">
                    <Col md="6">
                        <Form.Group >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" defaultValue={currentUser ? currentUser.firstName : ""} name="firstName" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Email Addresss</Form.Label>
                            <Form.Control type="email" defaultValue={currentUser ? currentUser.emailAddress : ""} name="emailAddress" onChange={(e) => handleChange(e)} required />
                        </Form.Group>
                    </Col>

                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" defaultValue={currentUser ? currentUser.lastName: ""} name="lastName" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" defaultValue={currentUser ? currentUser.phoneNumber : ""} name="phoneNumber" onChange={(e) => handleChange(e)} />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Button variant="success" type="submit">
                                Update
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <hr/>
            <Form action="#" onSubmit={(e) => submitPasswordChange(e)}>
                <Row as="div">
                    <Col md="12">
                        <h5>Change Password</h5>
                    </Col>
                </Row>
                <Row className="pt-10" as="div">
                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" name="oldPassword" onChange={(e) => handleChange(e)} minLength="8" required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Confrim Password</Form.Label>
                            <Form.Control type="password" name="newPassword" onChange={(e) => handleChange(e)} minLength="8" required />
                        </Form.Group>
                    </Col>

                    <Col md="6">
                        <Form.Group >
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="confirmNewPassword" onChange={(e) => handleChange(e)} minLength="8" required />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Button variant="success" type="submit">
                                Save
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </AppLayout>
    );
}

export default EditProfile;