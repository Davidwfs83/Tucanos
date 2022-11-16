import CenterPopUpTypes from './ceneterpopup.types';

export function LoadPopUpData(data,dataType = "") {
    return {
        type: CenterPopUpTypes.LOAD_DATA,
        payload: {
            data,
            dataType
        }
    }
}



export function ResetPopUpData() {
    return {
        type: CenterPopUpTypes.RESET_POP_UP
    }
}
export function ActiveResponseBox(StatusCode, Msg) {
    return {
        type: CenterPopUpTypes.ACTIVE_RESPONSE_BOX,
        payload: {
            StatusCode,
            Msg
        }
    }
}