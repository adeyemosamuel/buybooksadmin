import React, {Component, useContext} from 'react';
import {Row, Col} from 'react-bootstrap';
import AppLayout from '../layout/app-layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from  '@fortawesome/free-solid-svg-icons';
import CustomModal from '../../components/custom-modal';
import {AppContext} from '../../providers/app-provider';
import CustomTable from '../../components/custom-table';

const TableWrapper = () => {
    const {activateModal} = useContext(AppContext) || {};

    const specialOffers = [
        {id: 1, name: "Flash Sales", regStartDate: "2020-12-15 T 11:44", regEndDate: "2020-12-20 T 11:44", startDate: "2020-12-22 T 11:44", expiryDate: "2020-12-22 T 23:44"},
        {id: 2, name: "Give-away Tuesday", regStartDate: "2020-12-12 T 11:44", regEndDate: "2020-12-15 T 11:44", startDate: "2020-12-18 T 11:44", expiryDate: "2020-12-25 T 23:44"}
    ];

    const fetchBannerImages = (specialOfferId) => {
        return(
            <Row className="mt-10" as="div">
                <Col md="3">
                    <div className="image-area">
                        <img className="image-responsive" src="https://dummyimage.com/600x400/000/fff" alt="Product Image" />
                        <a className="remove-image d-inline" href="#" title="Delete Image">&#215;</a>
                    </div>
                </Col>
                <div className="clearfix"></div>
                <Col md="3">
                    <div className="image-area">
                        <img className="image-responsive" src="" alt="Product Image" />
                        <a className="remove-image d-inline" href="#" title="Delete Image">&#215;</a>
                    </div>
                </Col>
                <div className="clearfix"></div>
                <Col md="3">
                    <div className="image-area">
                        <img className="image-responsive" src="" alt="Product Image" />
                        <a className="remove-image d-inline" href="#" title="Delete Image">&#215;</a>
                    </div>
                </Col>
                <div className="clearfix"></div>
                <Col md="3">
                    <div className="image-area">
                        <img className="image-responsive" src="" alt="Product Image" />
                        <a className="remove-image d-inline" href="#" title="Delete Image">&#215;</a>
                    </div>
                </Col>
            </Row>
        );
    }

    const columns = [
        {
            dataField: 'id',
            text: 'ID'
        }, 
        {
            dataField: 'name',
            text: 'Offer Name'
        },
        {
            dataField: 'regStartDate',
            text: 'Registration Start Date'
        },
        {
            dataField: 'regEndDate',
            text: 'Registration End Date'
        },
        {
            dataField: 'startDate',
            text: 'Start Date'
        },
        {
            dataField: 'expiryDate',
            text: 'Expiry Date'
        },
        {
            dataField: "images",
            text: 'Images',
            formatter: (col, row) => {
                return (
                    <span className="v-al-middle" title="View" onClick={() => activateModal({show: true, headerTitle: "Banner Images", body: fetchBannerImages(row.id)})}>
                        <FontAwesomeIcon icon={faEye} size="lg" />
                    </span>
                )
            }
        }
    ];

    return <CustomTable data={specialOffers} columns={columns} />;
}

export default class ViewAll extends Component {
  render() {
    return(
      <AppLayout pageName="View All Special Offers">
        <Row as="div">
            <TableWrapper />
        </Row>
        <CustomModal />
      </AppLayout>
    );
  }
}