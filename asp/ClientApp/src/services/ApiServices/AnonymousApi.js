import axios from 'axios';
import { FormObjFactory } from '../Utility';
const baseURL = process.env.REACT_APP_API_URL;


// Anon Facade 1
export function CreateCustomer(newCustomer) {
    return axios.post(`${baseURL}/Anonymous/createnewcustomer`,
        FormObjFactory(newCustomer),
        {
            headers: { "Content-Type": "application/json" }
        });
}

// Anon Facade 3
export function GetAllFlights(flightQuery) {
    return axios.post(`${baseURL}/Anonymous/getallflights`,
        flightQuery,
        {
            headers: { "Content-Type": "application/json" }
        });
}


// Anon Facade 4
export function GetAllAirlines() {
    return axios.get(`${baseURL}/Anonymous/getallairlines`);
}


// Anon Facade 5
export function GetAllCountries() {
    return axios.get(`${baseURL}/Anonymous/getallcountries`);
}

// Anon Facade 6
export function RequestAirlineCreation(airlineRequest) {
    return axios.post(`${baseURL}/Anonymous/requestairlinecreation`,
        FormObjFactory(airlineRequest),
        {
            headers: { "Content-Type": "application/json" }
        });
}

// Anon Facade 7
export function GetReviewsByAirline(airlineId) {
    return axios.get(`${baseURL}/Anonymous/reviewsbyairline/${airlineId}`,
        {
            headers: { "Content-Type": "application/json" }
        });
}

//Anon Facade 8
export function GetFlight(flightId) {
    return axios.get(`${baseURL}/Anonymous/GetFlight/${flightId}`);
}

//Anon Facade 9
export function GetAirline(airlineId) {
    return axios.get(`${baseURL}/Anonymous/GetAirline/${airlineId}`);
}

//Anon Facade 10
export function GetThreeRandReview() {
    return axios.get(`${baseURL}/Anonymous/threerandreviews`);
}




// Upload Your Own Img
export function UploadImage(file) {
    var formData = new FormData();
    formData.append("Picture", file);
    return axios.post(
        `${baseURL}/Image/uploadmyimage`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}