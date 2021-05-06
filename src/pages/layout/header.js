import {useContext, useState, useEffect} from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faBars, faBell, faSignOutAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import {AppContext} from '../../providers/app-provider';
import Router from 'next/router';
import {logout} from '../../components/host-master';

const Header = () => {
    const {currentUser, toggleSpinner, toggleSidebar, setActive, appLogo} = useContext(AppContext) || {currentUser: {}};

    const getTitle = () => {
        return (
            <div className="pull-left custom-title">
                <img src={currentUser ? (currentUser.profilePhotoUrl || "https://dummyimage.com/600x400/000/fff") : "https://dummyimage.com/600x400/000/fff"} className="thumbnail-image" alt="Profile Photo"/>
                <span className="full-name">{currentUser ? (currentUser.firstName + ' ' + currentUser.lastName) : 'Full Name'}</span>
            </div>
        );
    }

    const toggleClick = (e) => {
        e.preventDefault();
        toggleSidebar();
    }
    
    const editProfile = async (e) => {
        e.preventDefault(); 
        toggleSpinner("show");
        e.preventDefault(); 
        await Router.push("/profile/edit");
        toggleSpinner("hide");
    }
    
    const handleLogout = async (e) => {
        e.preventDefault(); 
        toggleSpinner("show");
        logout();
        await Router.replace("/login");
        setActive({id: 1});
        toggleSpinner("hide");
    }

    return(
        <Navbar bg="light" expand="lg" className="bg-white b-bm">
            <Navbar.Brand href="/" className="w-100">
                <img src={appLogo} alt="Logo" itemProp="logo" />
            </Navbar.Brand>
            <Nav className="mr-auto sidebar-toggle">
                <Nav.Link href="#" title="Toggle Sidebar Menu" onClick={(e) => toggleClick(e)}>
                    <FontAwesomeIcon icon={faBars} size="lg"/>
                </Nav.Link>
            </Nav>
            <Nav className="ml-auto">
                {/* <Nav.Link href="#home" title="Notifications">
                    <FontAwesomeIcon icon={faBell} size="lg"/>
                </Nav.Link> */}
                <NavDropdown title={getTitle()} id="basic-nav-dropdown">
                    <NavDropdown.Item href="#" onClick={(e) => editProfile(e)}>
                        <FontAwesomeIcon icon={faUserEdit} size="sm" /> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item className="divider" />
                    <NavDropdown.Item href="#" onClick={(e) => {handleLogout(e)}}>
                        <FontAwesomeIcon icon={faSignOutAlt} size="sm" /> Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

export default Header;

// const ToggleSideBarButton = () => {
//     const {toggleSidebar} = useContext(AppContext) || {};

//     const toggleClick = (e) => {
//         e.preventDefault();
//         toggleSidebar();
//     }

//     return(
//         <Nav.Link href="#" title="Notifications" onClick={(e) => toggleClick(e)}>
//             <FontAwesomeIcon icon={faBars} size="lg"/>
//         </Nav.Link>
//     );
// }

// const EditProfile = () => {
//     const {toggleSpinner} = useContext(AppContext) || {};

//     const handleClick = async (e) => {
//         e.preventDefault(); 
//         toggleSpinner("show");
//         e.preventDefault(); 
//         await Router.push("/profile/edit");
//         toggleSpinner("hide");
//     }

//     return(
//         <NavDropdown.Item href="#" onClick={(e) => handleClick(e)}>
//             <FontAwesomeIcon icon={faUserEdit} size="sm" /> Profile
//         </NavDropdown.Item>
//     );
// }

// const Logout = () => {
//     const {toggleSpinner, setActive} = useContext(AppContext) || {};

//     const handleClick = async (e) => {
//         e.preventDefault(); 
//         toggleSpinner("show");
//         logout();
//         await Router.replace("/login");
//         setActive({id: 1});
//         toggleSpinner("hide");
//     }

//     return(
//         <NavDropdown.Item href="#" onClick={(e) => {handleClick(e)}}>
//             <FontAwesomeIcon icon={faSignOutAlt} size="sm" /> Logout
//         </NavDropdown.Item>
//     );
// }