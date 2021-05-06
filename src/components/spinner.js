import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useContext} from 'react';
import {AppContext} from '../providers/app-provider';

const Spinner = () => {
    const {showSpinner} = useContext(AppContext) || {};

    return(
        <div className="custom-spinner" hidden={!showSpinner}><FontAwesomeIcon icon={faSpinner} pulse size="5x"/></div>
    );
}

export default Spinner;