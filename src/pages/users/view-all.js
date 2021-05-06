import {useState, useContext, useEffect} from 'react';
import {Row, Button} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faToggleOff, faToggleOn} from  '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import CustomTable from '../../components/custom-table';
import {getAllProfilesUrl} from '../../networking/external-url';
import {AppContext} from '../../providers/app-provider';
import getData from '../../networking/send-get-request';


const ViewAllUsers = (props) => {
    const [state, setState] = useState({
        data: [],
        refresh: false
      });
    
      const {toggleSpinner} = useContext(AppContext) || {};
    
      useEffect(() => {
        getTableData();
      }, [state.refresh]);
    
      const getTableData = () => {
          toggleSpinner("show");
          getData(`${getAllProfilesUrl}ADMIN`)
          .then((data) => {
              if(data) {
                  if(data.responseCode == 99) {
                    setState({data: data.responseData});
                    toggleSpinner("hide");
                  }else{
                      console.log("Unable to fetch table data");
                      toggleSpinner("hide");
                  }
              }else {
                  console.log("Unable to fetch table data");
                  toggleSpinner("hide");
              }
          });
      }
    
      const editButton = (cell, row) => {
        return (
            <div>
                <Button variant="warning" title="Edit" className="btn-table" onClick={() => Router.push({pathname: "/users/edit/"+ row.id})}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>                   
            </div>
        );
    }
    
    const statusIndicator = (cell, row) => {
        if(row.isDisabled)
            return (
                <div>
                    <FontAwesomeIcon icon={faToggleOff} style={{color: "#b21f2d"}} size="2x" title="Disabled" />
                </div>
            );
        else 
            return (
                <div>
                    <FontAwesomeIcon icon={faToggleOn} style={{color: "#28a745"}} size="2x" title="Enabled" />
                </div>
            );
    }
    
    const columns = [
        {
            dataField: 'id',
            text: 'ID'
        }, 
        {
            dataField: 'firstName',
            text: 'First Name'
        }, 
        {
            dataField: 'lastName',
            text: 'Last Name'
        }, 
        {
            dataField: 'emailAddress',
            text: 'Email Address'
        }, 
        {
            dataField: 'role.name',
            text: 'Role'
        },  
        {
            dataField: 'createdOn',
            text: 'Date Created'
        },  
        {
            dataField: 'isDisabled',
            text: 'Status',
            formatter: statusIndicator
        },
        {
            dataField: "action",
            text: 'Action',
            formatter: editButton
        }
    ];

    return(
        <AppLayout pageName="View All Users">
        <Row as="div">
            <CustomTable data={state.data} columns={columns} />
        </Row>
        </AppLayout>
    );
}

export default ViewAllUsers;