import {useContext, useEffect} from 'react';
import Header from './header';
import Footer from './footer';
import Sidebar from './sidebar';
import { Col, Container, Row } from 'react-bootstrap';
import Spinner from '../../components/spinner';
import Router from 'next/router';
import {fetchCurrentUser, getUserToken, logout} from '../../components/host-master';
import { showAlertWithCallBack } from '../../components/alerter';
import { AppContext } from '../../providers/app-provider';
import getData from '../../networking/send-get-request';
import {getAppDetailsUrl} from '../../networking/external-url';

const AppLayout = (props) => {
    const showSideBar = (props.showSideBar == undefined || props.showSideBar == "Not available") ? true : 
    props.showSideBar;
    const showHeader = (props.showHeader == undefined || props.showHeader == "Not available") ? true : 
    props.showHeader;
    const showFooter = (props.showFooter == undefined || props.showFooter == "Not available") ? true : 
    props.showFooter;

    const {updateCu, setActive, updateAppLogo, updateContactDetails} = useContext(AppContext) || {};

    useEffect(() => {
        getAppDetails();
        if(getUserToken()) {
            fetchCurrentUser().then(data => {
                if(data) {
                    if(data.role.name != "ADMIN") {
                        showAlertWithCallBack("error", "Oops! You are not authorized to use this application. You'd be logged out", () => {logout(); Router.push("/login"); setActive({id: 1});});
                    }else updateCu(data);
                }else {
                    logout(); 
                    Router.replace("/login");
                    setActive({id: 1});
                }
            });
        }else {
            logout(); 
            Router.push("/login");
            setActive({id: 1});
        }
    }, [props.pageName]);

    const getAppDetails = async () => {
        let appDetailsResponse = await getData(getAppDetailsUrl);
        if(appDetailsResponse) {
            if(appDetailsResponse.responseCode == 99) {
                if(appDetailsResponse.responseData.appLogoUrl) {
                    updateAppLogo(appDetailsResponse.responseData.appLogoUrl);
                    updateContactDetails(appDetailsResponse.responseData);
                }
            }
        }
    }

    return(
        <>
            <Spinner />
            {showSideBar ? <Sidebar  /> : ""}
            <div className="w-75 d-white">
                {showHeader ? <Header  /> : ""}
                <Container className="app-container">
                    <Row align="center" className="center-items" as="div">
                        <h3 className="page-title">~&nbsp;{props.pageName}</h3>
                    </Row>
                    <Col md="12" className={`${props.pageName == "Dashboard" ? "": "white-pt-pb-15"}`}>
                        {props.children}
                    </Col>
                </Container>
                {showFooter ? <Footer  /> : ""}
            </div>
        </>
    );
}

export default AppLayout;