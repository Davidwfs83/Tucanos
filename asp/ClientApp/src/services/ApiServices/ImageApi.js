import axios from 'axios';
import {
    GetToken
} from '../AuthService';
const baseURL = process.env.REACT_APP_API_URL;

// Image Controller 1
export function GetUserImage(userId) {
    return axios.get(`${baseURL}/Image/${userId}`)
}

// Image Controller 2
export function GetCountryImage(countryId) {
    return axios.get(`${baseURL}/Image/getcountry/${countryId}`)
}



// Upload Your Own Img
export function UploadImage(file) {
    var token = GetToken();
    var formData = new FormData();
    formData.append("Picture", file);
    return axios.post(
        `${baseURL}/Image/uploadmyimage`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }
    )
}