import AuthActionsTypes from './auth.types';
import $ from 'jquery';
import {
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    parseJwt
} from '../../services/AuthService';
import { GetUserImage } from '../../services/ApiServices/ImageApi';
import { LoadPopUpData, ResetPopUpData } from '../CenterPopUp/ceneterpopup.actions';

const tokenRoleClaimName = process.env.REACT_APP_JWT_ROLE_CLAIM_KEY;



export function loginAction(username, password, history) {
    return (dispatch) => {
        login(username, password)
            .then((response) => {
                var parsedToken = parseJwt(response.data.info);
                saveTokenInLocalStorage(response.data.info);
                // Get User Image
                GetUserImage(parsedToken["userInfo"].UserFk.Id).then(response => {
                    runLogoutTimer(
                        dispatch,
                        parsedToken.exp * 1000,
                        history,
                    );
                    dispatch(loginConfirmedAction(parsedToken, response.data.info.imgStr))
                    
                })
                               
            })
            .catch((error) => {
                dispatch(loginFailedAction(error));
            });
    };
}



export function loginConfirmedAction(data, image) {
    
    
    return {
        type: AuthActionsTypes.LOGIN_CONFIRMED_ACTION,
        payload: {
            userType: data[tokenRoleClaimName],
            userInfo: data["userInfo"],
            image
        }
    };
}
export function UpdateLoggedUser(data, image) {
    return {
        type: AuthActionsTypes.UPDATE_USER,
        payload: {
            updatedInfo: data,
            image
        }
    };
}

export function loginFailedAction(data) {
    
    return {
        type: AuthActionsTypes.LOGIN_FAILED_ACTION,
        payload: data.response.data.Message,
    };
}

export function signupFailedAction(message) {
    return {
        type: AuthActionsTypes.SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function logout(history) {
    localStorage.removeItem('token');
    history.push('/');   
    return {
        type: AuthActionsTypes.LOGOUT_ACTION
    };
}
export function ResetError() {
    return {
        type: AuthActionsTypes.RESET_ERROR
    };
}
