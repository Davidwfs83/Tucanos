import CenterPopUpTypes from './ceneterpopup.types';


const initialState = {
    PopUpType: "",
    PopUpInfo: {},
    Response: {
        isActive: false,
        StatusCode: 0,
        Msg: ""
    }
};

const CenterPopUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case CenterPopUpTypes.LOAD_DATA:
            {
                return {
                    ...state,
                    PopUpInfo: action.payload.data,
                    PopUpType: action.payload.dataType
                }
            }
        case CenterPopUpTypes.ACTIVE_RESPONSE_BOX:
            return {
                ...state,
                Response: {
                    isActive: true,
                    StatusCode: action.payload.StatusCode,
                    Msg: action.payload.Msg
                }
            }

        case CenterPopUpTypes.RESET_POP_UP:
            return initialState;            
        default:
            return state;

    }
}
export default CenterPopUpReducer;