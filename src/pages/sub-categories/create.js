import {useState, useContext, useEffect} from 'react';
import AppLayout from '../layout/app-layout';
import {Col, Form, Row, Button} from 'react-bootstrap';
import postData from "../../networking/send-post-request";
import {addSubCategoryUrl, getCategoriesWithCustomParamsUrl} from "../../networking/external-url";
import {showAlert} from '../../components/alerter';
import {AppContext} from '../../providers/app-provider';
import Router from 'next/router';
import getData from '../../networking/send-get-request';

const Create = (props) => {
    const {toggleSpinner, setActive} = useContext(AppContext) || {};

    const [state, setState] = useState({
        name: "",
        categoryId: "",
        categories: [],
        refresh: false
    });

    useEffect(() => {
        toggleSpinner("show");
        getData(getCategoriesWithCustomParamsUrl)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    setState({categories: data.responseData.categories});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch categories");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch categories");
                toggleSpinner("hide");
            }
        });
    }, [state.refresh]);

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const submit = async (e) => {
        e.preventDefault();
        toggleSpinner("show");
        let addSubCategoryResponse = await postData(addSubCategoryUrl, state);
        if(addSubCategoryResponse) {
            if(addSubCategoryResponse.responseCode == 99) {
                showAlert("success", "New sub category created successfully");
                await Router.push("/sub-categories/view-all");
                setActive({id: 4, subMenuId: 1});
                toggleSpinner("hide");
            }else {
                toggleSpinner("hide");
                showAlert("error", addSubCategoryResponse.errorMessage);
            }
        }else {
            toggleSpinner("hide");
            showAlert("error", "Oops, an error occurred while trying to process your request. Possible solution: check your internet connection and retry later");
        }
    }

    return(
        <AppLayout pageName="Create Sub-Category">
            <Row as="div">
                <Col md="7" className="ml-auto mr-auto pt-10" as="div">
                    <Form action="#" method="post" onSubmit={(e) => submit(e)}>
                        <Form.Group >
                            <Form.Label>Sub Category Name</Form.Label>
                            <Form.Control type="text" className="t-t-cap" name="name" onChange={(e) => handleChange(e)} required />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Category</Form.Label>
                            <Form.Control required as="select" name="categoryId" className="t-t-cap" onChange={(e) => handleChange(e)}>
                                <option value="">- select one -</option>
                                {state.categories.map(cat => {
                                    return <option key={cat.id} value={cat.id} className="t-t-cap">{cat.name.toLowerCase()}</option>;
                                })}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group >
                            <Button variant="primary" type="submit">
                                Create
                            </Button>

                            <Button variant="danger" type="reset" className="btn-reset">
                                Clear
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </AppLayout>
    );
}

export default Create;