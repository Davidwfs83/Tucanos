import axios from 'axios';
import {
    GetToken
} from '../AuthService';
import { FormObjFactory } from '../Utility';

const baseURL = process.env.REACT_APP_API_URL;

//Airline Facade 1

export function CreateFlight(newFlight) {
    var token = GetToken();

    return axios.post(
        `${baseURL}/Airline/createflight`,
        newFlight,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Airline Facade 2
export function RemoveFlight(removedFlight) {
    var token = GetToken();   
    return axios.delete(
        `${baseURL}/Airline/removeflight/${removedFlight}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Airline Facade 4
export function GetTicketsByFlight(flightId) {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Airline/GetTicketsByFlight/${flightId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}
 //Airline Facade 5
export function GetMyDetails() {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Airline/mydetails`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}
 //Airline Facade 6
export function UpdateAirline(updatedAirline) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Airline/updatemydetails`,
        FormObjFactory(updatedAirline),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}
// Airline Facade 7
export function GetAllMyFlights(query) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Airline/GetAllMyFlights`,
        query,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

