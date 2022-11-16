import axios from 'axios';
import {
    GetToken
} from '../AuthService';
import { FormObjFactory } from '../Utility';

const baseURL = process.env.REACT_APP_API_URL;


//Customer Facade 1
export function BuyTicket(ticketDto) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Customer/buyticket`,
        ticketDto,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


//Customer Facade 2
export function GetCustomer() {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Customer/mydetails`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Customer Facade 3
export function GetActiveTickets() {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Customer/activetickets`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Customer Facade 4
export function UpdateMyDetails(updatedCustomer) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Customer/updatemydetails`,
        FormObjFactory(updatedCustomer),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Customer Facade 5
export function GetTicketsHistory() {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Customer/ticketshistory`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Customer Facade 6
export function RemoveTicket(ticketId) {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Customer/removeticket/${ticketId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}
