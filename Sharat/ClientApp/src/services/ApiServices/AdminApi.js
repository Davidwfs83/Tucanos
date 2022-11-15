import axios from 'axios';
import {
    GetToken
} from '../AuthService';
import { FormObjFactory } from '../Utility';
const baseURL = process.env.REACT_APP_API_URL;





//Admin Facade 1
export function QueryAllCustomers(query) {
    var token = GetToken();
    
    return axios.post(
        `${baseURL}/Admin/queryallcustomers`,
        query,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


//Admin Facade 2
export function UpdateCustomer(updatedCus) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Admin/updatecustomer`,
        FormObjFactory(updatedCus),
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
}

//Admin Facade 3  
export function RemoveCustomer(cusId) {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Admin/removecustomer?cusId=${cusId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
}

// Admin Facade 9
export function UpdateAirline(updatedAirline) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Admin/updateairline`,
        FormObjFactory(updatedAirline),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


//Admin Facade 10  
export function RemoveAirline(airlineId) {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Admin/removeairline?airlineId=${airlineId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
}

// Admin Facade 11
export function UpdateAdmin(updatedAdmin) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Admin/updateadmin`,
        updatedAdmin,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

// Admin Facade 12
export function QueryAllAdmins(query) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/queryalladmins`,
        query,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

//Admin Facade 13  
export function RemoveAdmin(adminId) {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Admin/removeadmin?adminId=${adminId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
}






// Admin Facade 14
export function CreateAirline(newAirline) {
    var token = GetToken();
    console.log(newAirline);
    return axios.post(
        `${baseURL}/Admin/createairline`,
        FormObjFactory(newAirline),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


// Admin Facade 15
export function CreateAdmin(newAdmin) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/createadmin`,
        FormObjFactory(newAdmin),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

// Admin Facade 16
export function CreateCountry(newCountry) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/createcountry`,
        FormObjFactory(newCountry),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


//Admin Facade 17 
export function RemoveCountry(countryId) {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Admin/removecountry?countryId=${countryId}`,
        {           
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
}


// Admin Facade 18
export function UpdateCountry(updatedCountry) {
    var token = GetToken();
    return axios.patch(
        `${baseURL}/Admin/updatecountry`,
        updatedCountry,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

// Admin Facade 19
export function GenerateData(recordsCount) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/datagenerator`,
        recordsCount,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}


// Admin Facade 20
export function ClearData() {
    var token = GetToken();
    return axios.delete(
        `${baseURL}/Admin/cleardatabase`,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
}

// Admin Facade 21
export function GetMyDetails() {
    var token = GetToken();
    return axios.get(
        `${baseURL}/Admin/mydetails`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

// Admin Facade 22
export function UpdateMyDetails(updatedAdmin) {
    var token = GetToken();
    
    return axios.patch(
        `${baseURL}/Admin/updatemydetails`,
        FormObjFactory(updatedAdmin),
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}

// Admin Facade 23
export function QueryAllAirlines(query) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/queryallairlines`,
        query,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}
// Admin Facade 24
export function QueryAllCountries(query) {
    var token = GetToken();
    return axios.post(
        `${baseURL}/Admin/queryallcountries`,
        query,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
}