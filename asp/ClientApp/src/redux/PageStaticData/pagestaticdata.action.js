import PageStaticDataTypes from './pagestaticdata.types';


export function LoadFirst(data, slotType) {
    return {
        type: PageStaticDataTypes.LOAD_FIRST_DATA_SLOT,
        payload: {
            data,
            slotType
        }
    }
}

export function LoadSecond(data, slotType) {
    return {
        type: PageStaticDataTypes.LOAD_SECOND_DATA_SLOT,
        payload: {
            data,
            slotType
        }
    }
}
export function LoadThird(data, slotType) {
    return {
        type: PageStaticDataTypes.LOAD_THIRD_DATA_SLOT,
        payload: {
            data,
            slotType
        }
    }
}

export function ResetFirst(data) {
    return {
        type: PageStaticDataTypes.RESET_FIRST_DATA_SLOT
    }
}

export function ResetSecond(data) {
    return {
        type: PageStaticDataTypes.RESET_SECOND_DATA_SLOT
    }
}


export function ResetAll(data) {
    return {
        type: PageStaticDataTypes.RESET_ALL_SLOT
    }
}