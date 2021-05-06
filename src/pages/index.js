import {useContext, useEffect} from 'react';
import Spinner from '../components/spinner';
import Router from 'next/router';
import {fetchCurrentUser, getUserToken, logout} from '../components/host-master';
import { showAlertWithCallBack } from '../components/alerter';
import { AppContext } from '../providers/app-provider';


const Main = () => {
    const {updateCu, setActive, toggleSpinner} = useContext(AppContext) || {};

    useEffect(() => {
        toggleSpinner("show");
        if(getUserToken()) {
            fetchCurrentUser().then(data => {
                toggleSpinner("hide");
                if(data) {
                    if(data.role.name != "ADMIN") {
                        showAlertWithCallBack("error", "Oops! You are not authorized to use this application. You'd be logged out", () => {logout(); Router.push("/login"); setActive({id: 1});});
                    }else {
                        updateCu(data);
                        Router.replace("/dashboard");
                    }
                }else {
                    logout(); 
                    Router.replace("/login");
                    setActive({id: 1});
                }
            });
        }else {
            toggleSpinner("hide");
            logout(); 
            Router.push("/login");
            setActive({id: 1});
        }
    }, []);

    return(
        <div>
            <Spinner />
        </div>
    );
}

export default Main;