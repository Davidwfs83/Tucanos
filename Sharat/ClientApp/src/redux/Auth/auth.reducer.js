import  AuthActionTypes from './auth.types';

const initialState = {
    Error: {
        Active: false,
        Msg: ""
    },
    currentUser: {
        userType: "",
        userInfo: {}
    },
    Image: {}
};



const AuthReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case AuthActionTypes.SIGNUP_CONFIRMED_ACTION:
            return {
                ...state,
                currentUser: action.payload
            }
        case AuthActionTypes.SIGNUP_FAILED_ACTION:
            return {
                ...state,
                Error: {
                    Active: true,
                    ErrMsg: action.payload
                }
            }
        case AuthActionTypes.LOGIN_CONFIRMED_ACTION:
            return {
                ...state,
                currentUser: {
                    userType: action.payload.userType,
                    userInfo: action.payload.userInfo
                },
                Image: action.payload.image,
                errorMessage: '',
                successMessage: 'Login Successfully Completed'        
            };
        case AuthActionTypes.LOGIN_FAILED_ACTION:
            return {
                ...state,
                Error: {
                    Active: true,
                    ErrMsg: action.payload
                }
            }
        case AuthActionTypes.RESET_ERROR:
            return {
                ...state,
                Error: {
                    Active: false,
                    ErrMsg: ""
                }
            }
        case AuthActionTypes.LOGOUT_ACTION:
            return initialState;

        case AuthActionTypes.UPDATE_USER:
            return {
                ...state,
                currentUser: {
                    userType: state.currentUser.userType,
                    userInfo: {
                        ...state.currentUser.userInfo,
                        ...action.payload.updatedInfo,
                        UserFk: {
                            ...state.currentUser.userInfo.UserFk,
                            ...action.payload.updatedInfo.UserFk
                        }
                    }
                },
                Image: action.payload.image === null ? state.Image : action.payload.image
            };
        default:
            return state;
    }


}

export default AuthReducer;