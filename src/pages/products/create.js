import React, {Component, useEffect, useState, useContext} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import getData from '../../networking/send-get-request';
import postData from '../../networking/send-post-request';
import { createProductUrl, getAllProductFormatsUrl, getAllProductLanguagesUrl, getBrandsWithCustomParamsUrl, getSubCategoriesWithCustomParamsUrl } from '../../networking/external-url';
import { AppContext } from '../../providers/app-provider';
import {showAlert} from '../../components/alerter';
import Router from 'next/router';

const Create = () => {
    const [state, setState] = useState({
        brandId: "",
        subCategoryId: "",
        name: "",
        author: "",
        description: "",
        price: "",
        quantityAvailable: "",
        brands: [],
        subCategories: [],
        productFormats: [],
        productLanguages: [],
        availableFormatIds: [],
        availableLanguageIds: [],
        productImages: []
    });
    
    const {toggleSpinner, setActive} = useContext(AppContext) || {};

    useEffect(() => {
        init();
    }, []);

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

        setState({...state, brands: brands, subCategories: subCategories, productFormats: productFormats, productLanguages: productLanguages});
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
        if(state.productImages.length == 0) {
            showAlert("error", "At least a product image is required. If this looks like an error, kindly click clear and start the process again");
            toggleSpinner("hide");
            return;
        }
        let addProductResponse = await postData(createProductUrl, state);
        if(addProductResponse) {
            if(addProductResponse.responseCode == 99) {
                showAlert("success", "New product created successfully");
                await Router.push("/products/view-all");
                setActive({id: 6, subMenuId: 1});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", addProductResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    return(
        <AppLayout pageName="Create Product">
            <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                <Row className="pt-10" as="div">
                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Brand</Form.Label>
                            <Form.Control name="brandId" className="t-t-cap" onChange={(e) => handleChange(e)} required as="select">
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
                            <Form.Control type="text" name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Quantity Available</Form.Label>
                            <Form.Control type="text" name="quantityAvailable" onChange={(e) => handleChange(e)} required />
                        </Form.Group>
                    </Col>

                    <Col md="6">
                        <Form.Group >
                            <Form.Label>Sub Category</Form.Label>
                            <Form.Control name="subCategoryId" className="t-t-cap" onChange={(e) => handleChange(e)} required as="select">
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
                            <Form.Control type="text" name="author" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Product Price</Form.Label>
                            <Form.Control type="number" name="price" onChange={(e) => handleChange(e)} required min="50" />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={(e) => handleChange(e)} rows="4" as="textarea" />
                        </Form.Group>
                    </Col>

                    <Col md="12">
                        <Form.Group >
                            <Form.Label>Product Images</Form.Label>
                            <Form.File accept="image/*" multiple onChange={(e) => handlePhotoChange(e)} required />
                            <Form.Text className="text-muted">
                                <strong style={{color: "#dc3545"}}>Note: Max number of images allowed per product is 5. </strong>You can select more than one image by pressing ctrl while clicking on an image. Thats is, ctrl + click
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
                                                    <Form.Check type="checkbox" label={productFormat.name.toLowerCase()} name={productFormat.id} data-group-name="format" onChange={(e) => handleMultiCheckAction(e)} className="t-t-cap" />
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
                                                    <Form.Check type="checkbox" label={productLanguage.name.toLowerCase()} name={productLanguage.id} data-group-name="language" onChange={(e) => handleMultiCheckAction(e)} className="t-t-cap" />
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
                                Create
                            </Button>

                            <Button variant="danger" type="reset" className="btn-reset">
                                Clear
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </AppLayout>
    );
}

export default Create;


