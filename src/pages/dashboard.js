import { faChartLine, faShoppingCart, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import AppLayout from './layout/app-layout';
import CustomTable from '../components/custom-table';

const transactions = [
    {id: 1, orderId: "BBIP-001", totalPrice: 1900, shippingCost: 500, totalNumberOfProducts: 4, transactionDate: "2020-12-15 T 22:44"},
    {id: 2, orderId: "BBIP-1234", totalPrice: 800, shippingCost: 200, totalNumberOfProducts: 1, transactionDate: "2020-12-30 T 11:24"}
];

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },  
    {
        dataField: 'orderId',
        text: 'Order ID'
    },
    {
        dataField: 'totalPrice',
        text: 'Total Price'
    },
    {
        dataField: 'shippingCost',
        text: 'Shipping Cost'
    },
    {
        dataField: 'totalNumberOfProducts',
        text: 'Total Number of Products'
    },
    {
        dataField: 'transactionDate',
        text: 'Transaction Date'
    }
];

const orders = [
  {id: 1, orderId: "BBIP-001", deliveryMethod: "Quick Delivery", totalPrice: 1900, orderedOn: "2020-12-15 T 11:44", orderedBy: "Joseph Patick", orderStatus: "PENDING", verifiedOn: "N/A", verifiedBy: "N/A", declineReason: "N/A"},
  {id: 2, orderId: "BBIP-1234", deliveryMethod: "Slow Delivery", totalPrice: 800, orderedOn: "2020-12-30 T 11:24", orderedBy: "Alfred Patick", orderStatus: "DECLINED", verifiedOn: "2020-12-30 T 15:24", verifiedBy: "Alphonsus Matthew", declineReason: "Out of stock"}
];

const orderColumns = [
  {
      dataField: 'orderId',
      text: 'Order ID'
  },
  {
      dataField: 'orderedOn',
      text: 'Order Date'
  },
  {
      dataField: 'orderedBy',
      text: 'Ordered By'
  },
  {
      dataField: 'orderStatus',
      text: 'Order Status'
  }
];

export default class Index extends Component {
  render() {
    return(
      <AppLayout pageName="Dashboard">
        <Row as="div">
          <Col md="12">
            <select className="dashboard-select">
              <option>This Year</option>
              <option>Last Six Months</option>
              <option>Last Quarter</option>
              <option>Last Two Months</option>
              <option>This Month</option>
            </select>
          </Col>
        </Row>

        <Row className="pt-pb-10 white-bg-row" as="div">
          <Col md="3" className="grid-item dashboard-border">
            <span className="p-5"><FontAwesomeIcon icon={faUsers} size="3x" className="icon-primary" /></span>
            <label>Total Users</label>
            <h4 className="f-w-bl">200</h4>
          </Col>
          <Col md="3" className="grid-item dashboard-border">
            <span className="p-5"><FontAwesomeIcon icon={faShoppingCart} size="3x" className="icon-primary" /></span>
            <label>Total Orders</label>
            <h4 className="f-w-bl">200</h4>
          </Col>
          <Col md="3" className="grid-item dashboard-border">
            <span className="p-5"><FontAwesomeIcon icon={faTruck} size="3x" className="icon-primary" /></span>
            <label>Pending Deliveries</label>
            <h4 className="f-w-bl">200</h4>
          </Col>
          <Col md="3" className="grid-item">
            <span className="p-5"><FontAwesomeIcon icon={faChartLine} size="3x" className="icon-primary" /></span>
            <label>Total Sales</label>
            <h4 className="f-w-bl">&#8358; 200</h4>
          </Col>
        </Row>

        <Row className="pt-pb-10 n-bg-row" as="div">
          <Col md="5" lg="5" sm="12" xs="12" className="white-bg-col mr-10">
            <h5>New Users</h5>
            <div className="new-user">
              <span className="image-holder">
                <img src="https://dummyimage.com/600x400/000/fff" className="avatar" alt="avatar"/> 
                <label className="pl-10 avatar-label">James Burton <span className="light-grey">CID: #1</span></label>
              </span>
              <span className="join-time light-grey">Joined 30 mins ago</span>
            </div>
            <div className="new-user">
              <span className="image-holder">
                <img src="https://dummyimage.com/600x400/000/fff" className="avatar" alt="avatar"/> 
                <label className="pl-10 avatar-label">Alex Burton <span className="light-grey">CID: #2</span></label>
              </span>
              <span className="join-time light-grey">Joined 30 mins ago</span>
            </div>
            <div className="new-user">
              <span className="image-holder">
                <img src="https://dummyimage.com/600x400/000/fff" className="avatar" alt="avatar"/> 
                <label className="pl-10 avatar-label">Sophie Burton <span className="light-grey">CID: #3</span></label>
              </span>
              <span className="join-time light-grey">Joined 30 mins ago</span>
            </div>
            <div className="new-user">
              <span className="image-holder">
                <img src="https://dummyimage.com/600x400/000/fff" className="avatar" alt="avatar"/> 
                <label className="pl-10 avatar-label">Phil Burton <span className="light-grey">CID: #4</span></label>
              </span>
              <span className="join-time light-grey">Joined 30 mins ago</span>
            </div>
            <div className="new-user">
              <span className="image-holder">
                <img src="https://dummyimage.com/600x400/000/fff" className="avatar" alt="avatar"/> 
                <label className="pl-10 avatar-label">Sonia Burton <span className="light-grey">CID: #5</span></label>
              </span>
              <span className="join-time light-grey">Joined 30 mins ago</span>
            </div>
          </Col>
          <div className="clearfix"></div>
          <Col md="6" lg="6" sm="12" xs="12" className="white-bg-col">
            <h5>Recent Orders</h5>
            <CustomTable data={orders} columns={orderColumns} />
          </Col>
        </Row>

        <Row className="pt-pb-10 white-bg-row p-l-0" as="div">
          <Col md="12">
            <h5>Transaction History</h5>
            <CustomTable data={transactions} columns={columns} />
          </Col>
        </Row>
      </AppLayout>
    );
  }
}