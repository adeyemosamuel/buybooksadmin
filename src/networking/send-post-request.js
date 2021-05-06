import {getUserToken} from '../components/host-master';

export default async function doPost(url, postData){
    console.log("POST URL: " + url);
    console.log("POST data: ", postData);
    const userToken = getUserToken();
    let jsonHeader = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
    if(userToken) jsonHeader["Authorization"] = `Bearer ${userToken}`;
    try{
        let response = await fetch(url, {
            method: 'POST',
            headers: jsonHeader,
            body: JSON.stringify(postData)
        });
        if(response.status == 401) return {
            errorMessage: "Oops! You need to be logged in to perform this action"
        };
        let responseToJson = await response.json();
        console.log("Response gotten (POST) is: ", responseToJson);
        return responseToJson;
    }catch(ex){
        console.log(ex);
        return null;
    }
}