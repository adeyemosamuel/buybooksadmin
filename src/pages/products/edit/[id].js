import React, {Component, useState, useEffect, useContext} from 'react';
import AppLayout from '../../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {getProductUrl, editProductUrl, deleteProductUrl, getAllProductFormatsUrl, getAllProductLanguagesUrl, getBrandsWithCustomParamsUrl, getSubCategoriesWithCustomParamsUrl, getAllProductImagesUrl} from '../../../networking/external-url';
import {AppContext} from '../../../providers/app-provider';
import getData from '../../../networking/send-get-request';
import postData from '../../../networking/send-post-request';
import {showAlert, showConfirmAlertWithCallBack, showAlertWithCallBack} from '../../../components/alerter';
import Router from 'next/router';

export default class EditProduct extends Component {
    static async getInitialProps({query}) {
        const {id} = query;
        return {id};
    }

    render() {
        return(
            <Edit id={this.props.id}/>
        );
    }
}

const Edit = (props) => {
    const {toggleSpinner} = useContext(AppContext) || {};

    const [state, setState] = useState({
        productId: props.id,
        hideProductImagesInput: true,
        brandId: "",
        subCategoryId: "",
        name: "",
        author: "",
        description: "",
        price: "",
        quantityAvailable: "",
        brands: [],
        subCategories: [],
        availableFormats: [],
        productFormats: [],
        availableLanguages: [],
        productLanguages: [],
        availableFormatIds: [],
        availableLanguageIds: [],
        existingProductImages: [],
        productImages: []
    });

    useEffect(() => {
        init();
    }, [state.productId]);

    const init = async () => {
        toggleSpinner("show");
        let brands = [];
        let subCategories = [];

        let brandsResponse = await getData(getBrandsWithCustomParamsUrl);
        if(brandsResponse) {
            if(brandsResponse.responseCode == 99)
                brands = brandsResponse.responseData.brands;
        }else console.log("Unable to fetch brands");

        let subCategoriesResponse = await getData(getSubCategoriesWithCustomParamsUrl);
        if(subCategoriesResponse) {
            if(subCategoriesResponse.responseCode == 99)
                subCategories = subCategoriesResponse.responseData.subCategories;
        }else console.log("Unable to fetch sub categories");

        let productFormats = [];
        let productLanguages = [];
        let productImages = [];
        const {availableFormatIds, availableLanguageIds} = state;

        let productFormatsResponse = await getData(getAllProductFormatsUrl);
        if(productFormatsResponse) {
            if(productFormatsResponse.responseCode == 99) 
                productFormats = productFormatsResponse.responseData;
        }else console.log("Unable to fetch product formats");

        let productLanguageResponse = await getData(getAllProductLanguagesUrl);
        if(productLanguageResponse) {
            if(productLanguageResponse.responseCode == 99) 
                productLanguages = productLanguageResponse.responseData;
        }else console.log("Unable to fetch product languages");

        let productImagesResponse = await getData(getAllProductImagesUrl + state.productId);
        if(productImagesResponse) {
            if(productImagesResponse.responseCode == 99)
                productImages = productImagesResponse.responseData;
        }else console.log("Unable to fetch product images");

        let product = {};
        let productResponse = await getData(getProductUrl + state.productId);
        if(productResponse) {
            if(productResponse.responseCode == 99) {
                product = productResponse.responseData.product;
                const {availableFormats, availableLanguages} = product;
                for(let i = 0; i < availableFormats.length; i++) 
                    availableFormatIds.push(availableFormats[i].id.toString());
                for(let i = 0; i < availableLanguages.length; i++) 
                    availableLanguageIds.push(availableLanguages[i].id.toString());
            }
        }else console.log("Unable to fetch product");

        setState({
            ...state, 
            brands: brands, 
            subCategories: subCategories, 
            productFormats: productFormats, 
            productLanguages: productLanguages,
            availableFormatIds: availableFormatIds,
            availableLanguageIds: availableLanguageIds, 
            existingProductImages: productImages,
            ...product,
            subCategoryId: product.subCategory.id,
            brandId: product.brand.id
        });
        toggleSpinner("hide");
    }

    const handleMultiCheckAction = (e) => {
        const {availableFormatIds, availableLanguageIds} = state;
        const {checked, name} = e.target;
        const {groupName} = e.target.dataset;
        if(checked) {
            if(groupName == "format") {
                if(!availableFormatIds[availableFormatIds.indexOf(name)]) 
                    availableFormatIds.push(name);
            }else {
                if(!availableLanguageIds[availableLanguageIds.indexOf(name)]) 
                    availableLanguageIds.push(name);
            }
        }else {
            if(groupName == "format") availableFormatIds.splice(availableFormatIds.indexOf(name), 1);
            else availableLanguageIds.splice(availableLanguageIds.indexOf(name), 1);
        }
        setState({...state, availableFormatIds: availableFormatIds, availableLanguageIds: availableLanguageIds});
    }

    const handlePhotoChange = (e) => {
        if(e.target.files && e.target.files[0]) {
            if(e.target.files.length > 5) {
                showAlert("error", "Images not added. Only a maximum of 5 images allowed per product");
                return;
            }
            for(let i = 0; i < e.target.files.length; i++) {
                let fileReader = new window.FileReader();
                let file = e.target.files[i];
                fileReader.readAsDataURL(file);
                fileReader.onload = (e) => {
                    const data = {
                        fileName: file.name,
                        fileSrc: e.target.result
                    }
                    const {productImages} = state;
                    productImages.push(data);
                    setState({...state, productImages: productImages});
                }
            }
        }
    }

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        if(state.productImages.length == 0 && state.existingProductImages.length == 0) {
            showAlert("error", "At least a product image is required. Please add at least one to to continue");
            toggleSpinner("hide");
            return;
        }
        let editProductResponse = await postData(editProductUrl, state);
        if(editProductResponse) {
            if(editProductResponse.responseCode == 99) {
                showAlert("success", "Product edited successfully");
                await Router.push("/products/view-all");
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", editProductResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    const deleteProduct = () => {
        showConfirmAlertWithCallBack("warning", "This product would be deleted!", () => performDelete());
    }

    const performDelete = () => {
        toggleSpinner("show");
        getData(deleteProductUrl + state.productId)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    showAlert("success", "Product deleted successfully");
                    Router.push("/products/view-all");
                    toggleSpinner("hide");
                }else {
                    toggleSpinner("hide");
                    showAlert("error", data.errorMessage);
                }
            }else {
                toggleSpinner("hide");
                showAlert("error", "Oops! This product cannot be deleted at the moment, try again later");
            }
        });
    }

    const deleteProductImage = (e, productImageId) => {
        e.preventDefault();
        showConfirmAlertWithCallBack("warning", "This image would be deleted!", () => deleteImage(productImageId));
    }

    const refreshProductImages = async () => {
        let productImagesResponse = await getData(getAllProductImagesUrl + state.productId);
        if(productImagesResponse) {
            if(productImagesResponse.responseCode == 99)
                setState({...state, existingProductImages: productImagesResponse.responseData});
        }else console.log("Unable to fetch product images");
    }

    const deleteImage = async (productImageId) => {
        toggleSpinner("show");
        const deleteProductImageResponse = await getData(deleteProductImageUrl + productImageId);
        if(deleteProductImageResponse) {
            toggleSpinner("hide");
            if(deleteProductImageResponse.responseCode == 79) showAlert("error", "Unable to delete product image at the moment. Please try agian later");
            else showAlertWithCallBack("success", "Product image deleted successfully", () => refreshProductImages());
        }else showAlert("error", "Unable to delete product image at the moment. Please try agian later");
    }

    const availableFormatsContain = (id, type) => {
        const filtered = type = "format" ? 
        state.availableFormats.filter(avFmt => avFmt.id == id) : 
        state.availableLanguages.filter(avLng => avLng.id == id);
        return (filtered.length > 0);
    }

    return(
        <AppLayout pageName="Edit Product">
            <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                <Row className="pt-10" as="div">
                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Brand</Form.Label>
                            <Form.Control name="brandId" className="t-t-cap" value={state.brandId} onChange={(e) => handleChange(e)} required as="select">
                                <option value="">- select one -</option>
                                {
                                    state.brands.map(brand => {
                                        return <option key={brand.id} value={brand.id} className="t-t-cap">{brand.name.toLowerCase()}</option>
                                    })
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" defaultValue={state.name} name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Quantity Available</Form.Label>
                            <Form.Control type="text" defaultValue={state.quantityAvailable} name="quantityAvailable" onChange={(e) => handleChange(e)} required />
                        </Form.Group>
                    </Col>

                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Sub Category</Form.Label>
                            <Form.Control name="subCategoryId" value={state.subCategoryId} className="t-t-cap" onChange={(e) => handleChange(e)} required as="select">
                                <option value="">- select one -</option>
                                {
                                    state.subCategories.map(subCategory => {
                                        return <option key={subCategory.id} value={subCategory.id} className="t-t-cap">{subCategory.name.toLowerCase()}</option>
                                    })
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Product Author</Form.Label>
                            <Form.Control type="text" defaultValue={state.author} name="author" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control type="number" defaultValue={state.price} name="price" onChange={(e) => handleChange(e)} required min="50" />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={(e) => handleChange(e)} rows="4" as="textarea" defaultValue={state.description} />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Form.Label>Product Images</Form.Label>
                            <div hidden={!state.hideProductImagesInput}>
                                <span title="Add" onClick={() => setState({...state, hideProductImagesInput: false})}><FontAwesomeIcon icon={faPlus} size="2x" /></span>
                            </div>
                            <Row className="mt-10" as="div">
                                {
                                    state.existingProductImages.length > 0 ? state.existingProductImages.map(productImage => {
                                        return(
                                            <Col md="3" key={productImage.id}>
                                                <div className="image-area">
                                                    <img className="image-responsive" src={productImage.imageUrl} alt="Product Image" />
                                                    <a className="remove-image d-inline" href="#" title="Delete Image" onClick={(e) => deleteProductImage(e, productImage.id)}>&#215;</a>
                                                </div>
                                            </Col>
                                        )
                                    }) : 
                                    <Col md="12">
                                        <div style={{textAlign: "center"}}>
                                            <span>No existing product image available</span>
                                        </div>
                                    </Col>
                                }
                            </Row>
                            <Form.File className="mt-10" accept="image/*" multiple onChange={(e) => handlePhotoChange(e)} hidden={state.hideProductImagesInput} />
                            <Form.Text className="text-muted" hidden={state.hideProductImagesInput}>
                                You can select more than one image by pressing ctrl while clicking on an image. Thats is, ctrl + click.
                            </Form.Text>
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Form.Label>Additional Details (Format and Languages)</Form.Label>
                            <Row className="mt-10 specification-row" as="div">
                                <Col md="6" className="s-pl-pr-0">
                                    <Form.Label style={{textTransform: "uppercase"}}>&bull; Available Formats</Form.Label>
                                    {
                                        state.productFormats.length > 0 ? state.productFormats.map((productFormat) => {
                                            return (
                                                <Form.Group controlId={"fm"+ productFormat.id} key={productFormat.id}>
                                                    <Form.Check type="checkbox" label={productFormat.name.toLowerCase()} name={productFormat.id} data-group-name="format" onChange={(e) => handleMultiCheckAction(e)} className="t-t-cap" defaultChecked={availableFormatsContain(productFormat.id, "format")} />
                                                </Form.Group>
                                            );
                                        }) : <div className="pl-10">Nothing to display...</div>
                                    }
                                </Col>
                                <div className="clearfix"></div>
                                <Col md="6" className="s-pl-pr-0">
                                    <Form.Label style={{textTransform: "uppercase"}}>&bull; Available Languages</Form.Label>
                                    {
                                        state.productLanguages.length > 0 ? state.productLanguages.map((productLanguage) => {
                                            return (
                                                <Form.Group controlId={"lng"+ productLanguage.id} key={productLanguage.id}>
                                                    <Form.Check type="checkbox" label={productLanguage.name.toLowerCase()} name={productLanguage.id} data-group-name="language" onChange={(e) => handleMultiCheckAction(e)} className="t-t-cap" defaultChecked={availableFormatsContain(productLanguage.id, "language")} />
                                                </Form.Group>
                                            );
                                        })  : <div className="pl-10">Nothing to display...</div>
                                    }
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                            <Button variant="danger" type="button" className="btn-reset" onClick={() => deleteProduct()}>
                                Delete Product
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </AppLayout>
    );
}