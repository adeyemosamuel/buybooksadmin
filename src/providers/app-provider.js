import React, {Component, createContext} from 'react';
import getData from '../networking/send-get-request';
import {getAppDetailsUrl} from '../networking/external-url';


export const AppContext = createContext();


export class AppProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSidebar: false,
            active: {
                id: 0,
                subMenuId: 0
            },
            customModal: {},
            showSpinner: false,
            currentUser: null,
            appLogo: "/static/images/logo.png",
            phoneNumbers: "",
            emailAddresses: "",
            address: "",
            displayBrands: "",
            primaryColor: "",
            secondaryColor: "",
            freeShippingAmount: "",
            freeReturnDays: ""
        }

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.setActive = this.setActive.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.updateCu = this.updateCu.bind(this);
        this.updateAppLogo = this.updateAppLogo.bind(this);
        this.updateContactDetails = this.updateContactDetails.bind(this);
    }

    toggleSidebar() {
        this.setState({showSidebar: !this.state.showSidebar});
    }

    setActive(data) {
        this.setState({active: {id: data.id, subMenuId: data.subMenuId}});
    }

    activateModal(data) {
        this.setState({customModal: data});
    }

    toggleSpinner(action) {
        this.setState({showSpinner: (action == "show")});
    }

    updateCu(cu) {
        this.setState({currentUser: cu});
    }

    updateAppLogo(appLogo) {
        this.setState({appLogo: appLogo});
    }

    updateContactDetails(data) {
        this.setState({
            phoneNumbers: data.appPhoneNumbers, 
            emailAddresses: data.appEmailAddresses, 
            address: data.appAddress,
            displayBrands: data.appDisplayBrands,
            primaryColor: data.appPrimaryColor,
            secondaryColor: data.appSecondaryColor,
            freeShippingAmount: data.appFreeShippingAmount,
            freeReturnDays: data.appFreeReturnDays
        });
    }

    render() {
        return(
            <AppContext.Provider value={{
                ...this.state, 
                toggleSidebar: this.toggleSidebar, 
                setActive: this.setActive, 
                activateModal: this.activateModal, 
                toggleSpinner: this.toggleSpinner,
                updateCu: this.updateCu,
                updateAppLogo: this.updateAppLogo,
                updateContactDetails: this.updateContactDetails
                }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}