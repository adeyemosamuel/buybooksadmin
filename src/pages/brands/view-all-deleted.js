import {useState, useEffect, useContext} from 'react';
import {Row, Button} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSyncAlt} from  '@fortawesome/free-solid-svg-icons';
import CustomTable from '../../components/custom-table';
import { getDeletedBrandsUrl, undoBrandDeleteUrl } from '../../networking/external-url';
import {AppContext} from '../../providers/app-provider';
import getData from '../../networking/send-get-request';
import { showAlert, showConfirmAlertWithCallBack } from '../../components/alerter';


const ViewAllDeleted = (props) => {
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
      getData(getDeletedBrandsUrl)
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

  const restoreButton = (cell, row) => {
    const buttonClick = () => {
      showConfirmAlertWithCallBack("warning", "This brand would be restored", () => buttonAction());
    }

    const buttonAction = () => {
      getData(`${undoBrandDeleteUrl}${row.id}`)
      .then((data) => {
          if(data) {
              if(data.responseCode == 99) {
                showAlert("success", "Brand restored successfully");
                setState({refresh: true});
              }else{
                  showAlert("error", data.errorMessage);
              }
          }else {
              showAlert("error", "Unable to restore brand at the moment. Try again later");
          }
      });
    }

    return (
        <div>
            <Button variant="success" title="Restore" className="btn-table" onClick={() => buttonClick()}><FontAwesomeIcon icon={faSyncAlt} size="sm" /></Button>                   
        </div>
    )
  }

  const columns = [
      {
          dataField: 'id',
          text: 'ID',
          hidden: true
      }, 
      {
          dataField: 'name',
          text: 'Brand Name'
      },
      {
          dataField: 'category.name',
          text: 'Category Name',
      },
      {
          dataField: "action",
          text: 'Action',
          formatter: restoreButton
      }
  ];

  return(
    <AppLayout pageName="View All Deleted Brands">
      <Row as="div">
          <CustomTable data={state.data} columns={columns} />
      </Row>
    </AppLayout>
  );
}

export default ViewAllDeleted;