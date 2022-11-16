import axios from 'axios';
import {
    loginConfirmedAction,
    logout
} from '../redux/Auth/auth.actions';
import { GetUserImage } from './ApiServices/ImageApi';



const baseURL = process.env.REACT_APP_API_URL;



export function login(username, password) {
    const postData = {
        username,
        password
    };
    return axios.post(
        `${baseURL}/Auth/token`,
        postData,
        {
            headers: { "Content-Type": "application/json" }
        }
    );
}



export function signUp(email, password) {
    const postData = {
        email,
        password
    };

    return axios.post(
        `${baseURL}/Auth/token`,
        postData,
        {
            headers: { "Content-Type": "application/json" }
        }
    );
}

export function saveTokenInLocalStorage(tokenDetails) {
    localStorage.setItem('token', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    
    setTimeout(() => {
        dispatch(logout(history));
    }, timer);
}

export function checkAutoLogin(dispatch, history) {
    const tokenDetailsString = GetToken();
    if (!tokenDetailsString) {
        return;
    }
    let tokenDetails = parseJwt(tokenDetailsString);
    
    let expireDate = new Date(tokenDetails["exp"] * 1000);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(logout(history));
        return;
    }
    // Get User Image
    GetUserImage(tokenDetails["userInfo"].UserFk.Id).then(response => {
        dispatch(loginConfirmedAction(tokenDetails, dispatch));
        const timer = expireDate - todaysDate;
        runLogoutTimer(dispatch, timer, history);
        dispatch(loginConfirmedAction(tokenDetails, response.data.info.imgStr))
        
    })   
}

export function GetToken() {
    return localStorage.getItem('token') === null ? null : localStorage.getItem('token').replace(/"/g, '');
}

export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    jsonPayload = JSON.parse(jsonPayload);
    jsonPayload.userInfo = JSON.parse(jsonPayload.userInfo);
    return jsonPayload;
};




