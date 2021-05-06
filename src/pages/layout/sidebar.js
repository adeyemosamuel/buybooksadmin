import {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronDown, faChevronRight, faUser, faUserCircle, faTimes, faEye, faGift, faBox, faBoxes, faBoxOpen, faIdCard, faIdCardAlt, faGifts, faBook, faBookOpen, faShoppingCart, faPenAlt, faCheck, faBan, faBus, faTruck, faEyeSlash, faBullseye, faCheckDouble, faReceipt, faCog, faTruckLoading, faLanguage, faAddressBook, faBookReader, faFileCode, faFolderOpen, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import {AppContext} from '../../providers/app-provider';
import Router from 'next/router';

const Sidebar = () => {
    const {showSidebar, toggleSidebar, active, setActive, toggleSpinner, appLogo} = useContext(AppContext) || {active: {}};

    const toggleClick = (e) => {
        if(e) e.preventDefault();
        toggleSidebar();
    }

    const setAsActive = (e) => {
        const id = e.currentTarget.dataset.id;
        const subMenuId = e.currentTarget.dataset.submenuid;
        const data = {id: id, subMenuId: subMenuId};
        if(!id) delete data["id"];
        if(!subMenuId) delete data["subMenuId"];
        setActive({id: id, subMenuId: subMenuId});
    }

    const getClassName = (id, isSubMenu, subMenuId) => {
        if(!isSubMenu) {
            return active.id == id ? "active" : "collapsed";
        }else {
            if(!subMenuId) 
                return active.id == id ? "sub-menu" : "sub-menu collapse";
            else 
                return active.subMenuId == subMenuId ? "active" : "";
        }
    }

    const RightIcon = (props) => {
        if(active.id == props.id)
            return <FontAwesomeIcon className="icon-right" icon={faChevronDown} size="lg" />;
        else
            return <FontAwesomeIcon className="icon-right" icon={faChevronRight} size="lg" />;
    }

    const navigate = async (e, url) => {
        toggleSpinner("show");
        setAsActive(e); 
        await Router.push(url); 
        toggleClick();
        toggleSpinner("hide");
    }

    return(
        <div className={`nav-side-menu ${showSidebar ? "show" : "hide"}`}>
            <div className="brand">
                <a  href="/">
                    <img src={appLogo} alt="Logo" itemProp="logo" />
                </a>
            </div>

            <div className="w-100 hide-big">
                <a href="#" title="Close" onClick={(e) => toggleClick(e)}>
                    <FontAwesomeIcon className="close-icon" icon={faTimes} size="lg" />
                </a>
            </div>
        
            <div className="menu-list">
    
                <ul id="menu-content" className={`menu-content collapse ${showSidebar ? "show" : "hide"} out`}>
                    <li className={getClassName(1)} data-id="1" onClick={(e) => navigate(e, "/dashboard")}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faHome} size="lg" /> <span className="a-text">Dashboard</span>
                        </div>
                    </li>

                    <li className={getClassName(2)} data-id="2" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faUser} size="lg" /> <span className="a-text">Users</span> <RightIcon id="2" />
                        </div>
                    </li>
                    <ul data-id="2" className={getClassName(2, true)}>
                        <li className={getClassName(2, true, 1)} data-id="2" data-submenuid="1" onClick={(e) => navigate(e, "/users/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Users</a>
                        </li>
                        <li className={getClassName(2, true, 2)} data-id="2" data-submenuid="2" onClick={(e) => navigate(e, "/users/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faUserCircle} size="lg" />Create User</a>
                        </li>
                    </ul>

                    <li className={getClassName(3)} data-id="3" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faBox} size="lg" /> <span className="a-text">Categories</span> <RightIcon id="3" />
                        </div>
                    </li>
                    <ul data-id="3" className={getClassName(3, true)}>
                        <li className={getClassName(3, true, 1)} data-id="3" data-submenuid="1" onClick={(e) => navigate(e, "/categories/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Categories</a>
                        </li>
                        <li className={getClassName(3, true, 2)} data-id="3" data-submenuid="2" onClick={(e) => navigate(e, "/categories/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faBoxes} size="lg" />Create Category</a>
                        </li>
                    </ul>

                    <li className={getClassName(4)} data-id="4" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faBoxOpen} size="lg" /> <span className="a-text">Sub-Categories</span> <RightIcon id="4" />
                        </div>
                    </li>
                    <ul data-id="4" className={getClassName(4, true)}>
                        <li className={getClassName(4, true, 1)} data-id="4" data-submenuid="1" onClick={(e) => navigate(e, "/sub-categories/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Sub-Categories</a>
                        </li>
                        <li className={getClassName(4, true, 2)} data-id="4" data-submenuid="2" onClick={(e) => navigate(e, "/sub-categories/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faBoxes} size="lg" />Create Sub-Category</a>
                        </li>
                    </ul>

                    <li className={getClassName(5)} data-id="5" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faIdCard} size="lg" /> <span className="a-text">Brands</span> <RightIcon id="5" />
                        </div>
                    </li>
                    <ul data-id="5" className={getClassName(5, true)}>
                        <li className={getClassName(5, true, 1)} data-id="5" data-submenuid="1" onClick={(e) => navigate(e, "/brands/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Brands</a>
                        </li>
                        <li className={getClassName(5, true, 2)} data-id="5" data-submenuid="2" onClick={(e) => navigate(e, "/brands/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faIdCardAlt} size="lg" />Create Brand</a>
                        </li>
                    </ul>

                    <li className={getClassName(6)} data-id="6" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faBook} size="lg" /> <span className="a-text">Products</span> <RightIcon id="6" />
                        </div>
                    </li>
                    <ul data-id="6" className={getClassName(6, true)}>
                        <li className={getClassName(6, true, 1)} data-id="6" data-submenuid="1" onClick={(e) => navigate(e, "/products/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Products</a>
                        </li>
                        <li className={getClassName(6, true, 2)} data-id="6" data-submenuid="2" onClick={(e) => navigate(e, "/products/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faBookOpen} size="lg" />Create Product</a>
                        </li>
                        <li className={getClassName(6, true, 3)} data-id="6" data-submenuid="3" onClick={(e) => navigate(e, "/products/view-product-languages")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faLanguage} size="lg" />View Product Langauges</a>
                        </li>
                        <li className={getClassName(6, true, 4)} data-id="6" data-submenuid="4" onClick={(e) => navigate(e, "/products/create-product-language")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faBookReader} size="lg" />Create Product Language</a>
                        </li>
                        <li className={getClassName(6, true, 5)} data-id="6" data-submenuid="5" onClick={(e) => navigate(e, "/products/view-product-formats")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faFolderOpen} size="lg" />View Product Formats</a>
                        </li>
                        <li className={getClassName(6, true, 6)} data-id="6" data-submenuid="6" onClick={(e) => navigate(e, "/products/create-product-format")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faFolderPlus} size="lg" />Create Product Format</a>
                        </li>
                    </ul>

                    <li className={getClassName(7)} data-id="7" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faGift} size="lg" /> <span className="a-text">Special Offers</span> <RightIcon id="7" />
                        </div>
                    </li>
                    <ul data-id="7" className={getClassName(7, true)}>
                        <li className={getClassName(7, true, 1)} data-id="7" data-submenuid="1" onClick={(e) => navigate(e, "/special-offers/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Special Offers</a>
                        </li>
                        <li className={getClassName(7, true, 2)} data-id="7" data-submenuid="2" onClick={(e) => navigate(e, "/special-offers/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faGifts} size="lg" />Create Special Offer</a>
                        </li>
                    </ul>

                    <li className={getClassName(8)} data-id="8" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faShoppingCart} size="lg" /> <span className="a-text">Orders</span> <RightIcon id="8" />
                        </div>
                    </li>
                    <ul data-id="8" className={getClassName(8, true)}>
                        <li className={getClassName(8, true, 1)} data-id="8" data-submenuid="1" onClick={(e) => navigate(e, "/orders/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View Orders</a>
                        </li>
                        <li className={getClassName(8, true, 2)} data-id="8" data-submenuid="2" onClick={(e) => navigate(e, "/orders/view-all-pending")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faPenAlt} size="lg" />View Pending Orders</a>
                        </li>
                        <li className={getClassName(8, true, 3)} data-id="8" data-submenuid="3" onClick={(e) => navigate(e, "/orders/view-all-approved")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faCheck} size="lg" />View Approved Orders</a>
                        </li>
                        <li className={getClassName(8, true, 4)} data-id="8" data-submenuid="4" onClick={(e) => navigate(e, "/orders/view-all-declined")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faBan} size="lg" />View Declined Orders</a>
                        </li>
                    </ul>

                    <li className={getClassName(9)} data-id="9" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faTruck} size="lg" /> <span className="a-text">Delivery</span> <RightIcon id="9" />
                        </div>
                    </li>
                    <ul data-id="9" className={getClassName(9, true)}>
                        <li className={getClassName(9, true, 1)} data-id="9" data-submenuid="1" onClick={(e) => navigate(e, "/delivery/methods/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View All Delivery Methods</a>
                        </li>
                        <li className={getClassName(5, true, 2)} data-id="9" data-submenuid="2" onClick={(e) => navigate(e, "/delivery/methods/create")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faTruckLoading} size="lg" />Create Delivery Method</a>
                        </li>
                        <li className={getClassName(9, true, 3)} data-id="9" data-submenuid="3" onClick={(e) => navigate(e, "/delivery/view-orders-pending-delivery")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEyeSlash} size="lg" />View Orders Pending Delivery</a>
                        </li>
                        <li className={getClassName(9, true, 4)} data-id="9" data-submenuid="4" onClick={(e) => navigate(e, "/delivery/view-orders-partially-delivered")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faCheck} size="lg" />View Orders Partially Delivered</a>
                        </li>
                        <li className={getClassName(9, true, 5)} data-id="9" data-submenuid="5" onClick={(e) => navigate(e, "/delivery/view-all-delivered-orders")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faCheckDouble} size="lg" />View All Delivered Orders</a>
                        </li>
                    </ul>

                    <li className={getClassName(10)} data-id="10" onClick={(e) => setAsActive(e)}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faReceipt} size="lg" /> <span className="a-text">Transactions</span> <RightIcon id="10" />
                        </div>
                    </li>
                    <ul data-id="10" className={getClassName(10, true)}>
                        <li className={getClassName(10, true, 1)} data-id="10" data-submenuid="1" onClick={(e) => navigate(e, "/transactions/view-all")}>
                            <a href="#"><FontAwesomeIcon className="icon-left" icon={faEye} size="lg" />View All</a>
                        </li>
                    </ul>

                    <li className={getClassName(11)} data-id="11" onClick={(e) => navigate(e, "/settings/view")}>
                        <div className="li-div">
                            <FontAwesomeIcon className="icon-left" icon={faCog} size="lg" /> <span className="a-text">Settings</span>
                        </div>
                    </li>
    
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;