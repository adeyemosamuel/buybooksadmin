import AppLayout from '../../layout/app-layout';
import {Col, Row, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faEdit} from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import {getAllBlogPostsUrl} from '../../../networking/external-url';
import CustomTable from '../../../components/custom-table';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../providers/app-provider';
import postData from '../../../networking/send-get-request';

const TableWrapper = (props) => {
    const actionButtons = (cell, row) => {
        return <Button variant="warning" title="Edit Post" className="btn-table" style={{marginBottom: 5}} onClick={() => Router.push({pathname: "/settings/blog/edit/"+ row.id})}><FontAwesomeIcon icon={faEdit} size="sm" /></Button>
    }

    const columns = [
        {
            dataField: 'id',
            text: 'Post ID',
            sort: true
        }, 
        {
            dataField: 'postTitle',
            text: 'Post Title',
            sort: true
        },
        {
            dataField: 'createdBy',
            text: 'Created By',
            formatter: (col, row) => {
                return col ? <span className="v-al-middle">{`${col.firstName} ${col.lastName}`}</span> : <></>
            }
        },
        {
            dataField: "action",
            text: 'Action',
            formatter: actionButtons
        }
    ];

    // return <CustomTable columns={columns} ajaxUrl={getAllOrdersWithCustomParamsFilter} dataName="orders" />;
    return <CustomTable data={props.blogPosts} columns={columns} />;
}

const Manage = () => {
    const {toggleSpinner} = useContext(AppContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getBlogPosts();
    }, []);

    const getBlogPosts = async () => {
        let blogPostsResponse = await postData(getAllBlogPostsUrl);
        if(blogPostsResponse) {
            if(blogPostsResponse.responseCode == 99) 
                setPosts(blogPostsResponse.responseData);
        }
    }

    const createPost = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        await Router.push("/settings/blog/create");
        toggleSpinner("hide");
    }

    const returnToPreviousPage = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        await Router.push("/settings/view");
        toggleSpinner("hide");
    }

    return(
        <AppLayout pageName="Manage Blog">
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <a className="edit-left" style={{paddingTop: 10}} href="#" onClick={(e) => returnToPreviousPage(e)}><FontAwesomeIcon size="1x" icon={faArrowLeft} />&nbsp;&nbsp;Return</a>
                    <Button className="edit-right" variant="info" onClick={(e) => createPost(e)}>Create Blog Post</Button>
                </Col>
            </Row>
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <hr/>
                </Col>
            </Row>
            <Row as="div">
                <Col md="8" className="ml-auto mr-auto pt-10" as="div">
                    <TableWrapper blogPosts={posts} />
                </Col>
            </Row>
        </AppLayout>
    );
}

export default Manage;