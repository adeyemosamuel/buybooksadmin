import React, { Component, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CKEditor from 'ckeditor4-react';
import AppLayout from '../../../layout/app-layout';
import {Col, Row, Button, Form} from 'react-bootstrap';
import { AppContext } from '../../../../providers/app-provider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { showAlert, showAlertWithCallBack, showConfirmAlertWithCallBack } from '../../../../components/alerter';
import getData from '../../../../networking/send-get-request';
import postData from '../../../../networking/send-post-request';
import {uploadBlogImagesUrl, editBlogPostUrl, getBlogPostUrl, deleteBlogPostUrl} from '../../../../networking/external-url';
import Router from 'next/router';

export default class EditBlogPost extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    constructor(props) {
        super(props);

        this.state = {
            blogPostId: props.id,
            data: '',
            showImagePane: false,
            postImages: [],
            postThumbnail: null,
            postThumbnailName: null,
            postTitle: null,
            uploadInitiated: false,
            changePostThumbnail: false
        };

        this.onEditorChange = this.onEditorChange.bind(this);
    }

    componentDidMount() {
        this.getPostContent();
    }

    async getPostContent() {
        let postContentResponse = await getData(getBlogPostUrl + this.state.blogPostId);
        if(postContentResponse) {
            if(postContentResponse.responseCode == 99) {
                this.setState({
                    data: postContentResponse.responseData.rawPostContent, 
                    postTitle: postContentResponse.responseData.post.postTitle,
                    postThumbnail: postContentResponse.responseData.post.postDisplayImageUrl
                });
            }else console.log("An error occurred while trying to fetch post content \n", postContentResponse.errorMessage);
        }else console.log("An error occurred while tring to fetch post content");
    }

    onEditorChange(evt) {
        this.setState({
            data: evt.editor.getData()
        });
    }

    handleThumbnailChange(e) {
        if(e.target.files && e.target.files[0]) {
            let fileReader = new window.FileReader();
            let file = e.target.files[0];
            fileReader.readAsDataURL(file);
            fileReader.onload = (e) => this.setState({postThumbnailName: file.name, postThumbnail: e.target.result});
        }
    }

    handlePhotoChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            let images = [];
            for(let i = 0; i < e.target.files.length; i++) {
                let fileReader = new window.FileReader();
                let file = e.target.files[i];
                fileReader.readAsDataURL(file);
                fileReader.onload = (e) => {
                    const data = {
                        fileName: file.name,
                        fileSrc: e.target.result
                    }
                    images.push(data);
                }
            }
            showConfirmAlertWithCallBack("warning", "Do you want to initiate upload process? If you click proceed, please do not re-initiate. You'd be notified once your upload is completed.", () => this.uploadBlogImages(images));
        }
    }

    async uploadBlogImages(imageData) {
        this.setState({uploadInitiated: true});
        let uploadBlogPostImagesResponse = await postData(uploadBlogImagesUrl, {blogImages: imageData});
        if(uploadBlogPostImagesResponse) {
            if(uploadBlogPostImagesResponse.responseCode == 99) 
                this.setState({postImages: uploadBlogPostImagesResponse.responseData});
            else showAlert("error", uploadBlogPostImagesResponse.errorMessage);
            this.setState({uploadInitiated: false});
        }else showAlert("error", "Oops! Post images cannot be uploaded at the moment. Please try again later");
    }

    render() {
        return (
            <AppLayout pageName="Edit Blog Post">
                <ReturnToPreviousPage />
                <Row as="div">
                    <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                        <Form.Group>
                            <Form.Label>Blog Post Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title here" value={this.state.postTitle ? this.state.postTitle : ""} onChange={(e) => this.setState({postTitle: e.target.value})}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row as="div">
                    <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                        <Form.Group>
                            <Form.Label>Blog Post Display Image</Form.Label>
                            <Form.File accept="image/*" onChange={(e) => this.handleThumbnailChange(e)} hidden={!this.state.changePostThumbnail} />
                            <Col md="12" as="div">
                                <img className="image-responsive-half" src={this.state.postThumbnail} alt="Blog Post Display Image" hidden={this.state.changePostThumbnail} />
                                <a href="#" className="edit-right" onClick={() => this.setState({changePostThumbnail: true})} hidden={this.state.changePostThumbnail}>Change Display Image</a>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row as="div">
                    <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                        <Form.Group>
                            <Button variant="primary" className="edit-right" style={{margin: 10}} hidden={this.state.showImagePane} onClick={() => this.setState({showImagePane: true})}>Add Image to Blog Content</Button>
                            <Button variant="secondary" className="edit-right" style={{margin: 10}} hidden={!this.state.showImagePane} onClick={() => this.setState({showImagePane: false})}>Hide Image Pane</Button>
                        </Form.Group>
                    </Col>
                </Row>
                <Row as="div">
                    <Col md={!this.state.showImagePane ? "12" : "8"} className="ml-auto mr-auto pt-10" as="div">
                        <CKEditor
                        data={this.state.data}
                        onChange={this.onEditorChange} />
                    </Col>
                    <Col md="4" className="ml-auto mr-auto pt-10" as="div" hidden={!this.state.showImagePane}>
                        <Form action="#">
                            <Form.File accept="image/*" multiple onChange={(e) => this.handlePhotoChange(e)} required />
                            <Form.Text className="text-muted">
                                <strong style={{color: "#dc3545"}}>Note: </strong>You can select more than one image by pressing ctrl while clicking on an image. Thats is, ctrl + click
                            </Form.Text>
                            <Button type="reset" variant="danger">Clear File Selector</Button>
                        </Form>
                        <RenderImageContent postImages={this.state.postImages} uploadInitiated={this.state.uploadInitiated} />
                    </Col>
                </Row>
                <Row as="div">
                    <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                        <EditorPreview data={this.state.data} />
                    </Col>
                </Row>
                <PublishPost postId={this.state.blogPostId} data={this.state.data} postTitle={this.state.postTitle} postDisplayImageName={this.state.postThumbnailName} postDisplayImage={this.state.postThumbnail} postImages={this.state.postImages} />
            </AppLayout>
        );
    }
}

class EditorPreview extends Component {
    render() {
        return (
            <div className="editor-preview">
                <h4 style={{textDecoration: "underline"}}>Rendered content/Preview</h4>
                <div dangerouslySetInnerHTML={{ __html: this.props.data }}></div>
            </div>
        );
    }
}

EditorPreview.defaultProps = {
    data: ''
};

EditorPreview.propTypes = {
    data: PropTypes.string
};

const ReturnToPreviousPage = () => {
    const {toggleSpinner} = useContext(AppContext);

    const returnToPreviousPage = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        await Router.push("/settings/blog/manage");
        toggleSpinner("hide");
    }

    return (
        <Row as="div">
            <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                <a className="edit-left" style={{paddingTop: 10}} href="#" onClick={(e) => returnToPreviousPage(e)}><FontAwesomeIcon size="1x" icon={faArrowLeft} />&nbsp;&nbsp;Return to previous page</a>
            </Col>
        </Row>
    );
}

const PublishPost = (props) => {
    const {toggleSpinner} = useContext(AppContext);

    const returnToPreviousPage = async () => {
        await Router.push("/settings/blog/manage");
        toggleSpinner("hide");
    }

    const publish = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        const {data, postTitle, postDisplayImageName, postDisplayImage, postImages, postId} = props;
        if(!postTitle) {
            showAlert("error", "Oops! Post title is required");
            toggleSpinner("hide");
            return;
        }
        if(!postDisplayImage) {
            showAlert("error", "Oops! Post display image is required");
            toggleSpinner("hide");
            return;
        }
        if(!data) {
            showAlert("error", "Oops! You cannot publish an empty post");
            toggleSpinner("hide");
            return;
        }
        let contentImageIds = [];
        if(postImages) {
            for(let i = 0; i < postImages.length; i++) {
                const imageId = postImages[i].id;
                contentImageIds.push(imageId);
            }
        }
        const postRequestData = {
            postId: postId,
            title: postTitle,
            displayImage: {
                fileName: postDisplayImageName,
                fileSrc: postDisplayImage
            },
            contentImageIds: contentImageIds.length == 0 ? null : contentImageIds,
            content: data
        }
        if(!postDisplayImageName) delete postRequestData.displayImage;
        let publishPostResponse = await postData(editBlogPostUrl, postRequestData);
        if(publishPostResponse) {
            if(publishPostResponse.responseCode == 99) 
                showAlertWithCallBack("success", "Post edited successfully", () => returnToPreviousPage());
            else showAlert("error", publishPostResponse.errorMessage);
        }else showAlert("error", "Oops! An error occurred while trying to edit post. Possible solution: check your internet connection and try again later");
        toggleSpinner("hide");
    }

    const deletePost = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        const {postId} = props;
        let deletePostResponse = await getData(deleteBlogPostUrl + postId);
        if(deletePostResponse) {
            if(deletePostResponse.responseCode == 99) 
                showAlertWithCallBack("success", "Post deleted successfully", () => returnToPreviousPage());
            else showAlert("error", deletePostResponse.errorMessage);
        }else showAlert("error", "Oops! An error occurred while trying to delete post. Possible solution: check your internet connection and try again later");
        toggleSpinner("hide");
    }

    return (
        <Row as="div">
            <Col md="12" className="ml-auto mr-auto pt-10" as="div">
                <Button variant="danger" className="edit-left" onClick={(e) => deletePost(e)}>Delete Post</Button>
                <Button variant="info" className="edit-right" onClick={(e) => publish(e)}>Save Post</Button>
            </Col>
        </Row>
    );
}

const RenderImageContent = (props) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages(props.postImages);
    }, [props]);
    
    return (
        <Col md="12">
            <span hidden={!props.uploadInitiated}>File upload in progress...</span>
            {
                images ? images.map(pi => {
                    return(
                        <div key={pi.id} style={{padding: 5}}>
                            <img src={pi.postImageUrl} alt="Post Image" style={{maxWidth: 260}} />
                        </div>
                    )
                }): <></>
            }
        </Col>
    )
}