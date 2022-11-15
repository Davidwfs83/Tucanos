import PageStaticDataTypes from './pagestaticdata.types';


const initialState = {
    SlotOne: {
        SlotType: "",
        SlotInfo: {}
    },
    SlotTwo: {
        SlotType: "",
        SlotInfo: {}
    },
    SlotThree: {
        SlotType: "",
        SlotInfo: {}
    }
};

const PageStaticDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case PageStaticDataTypes.LOAD_FIRST_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotOne: {
                        SlotType: action.payload.slotType,
                        SlotInfo: action.payload.data
                    }
                }
            }
        case PageStaticDataTypes.LOAD_SECOND_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotTwo: {
                        SlotType: action.payload.slotType,
                        SlotInfo: action.payload.data
                    }
                }
            }
        case PageStaticDataTypes.LOAD_THIRD_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotThree: {
                        SlotType: action.payload.slotType,
                        SlotInfo: action.payload.data
                    }
                }
            }
        case PageStaticDataTypes.RESET_FIRST_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotOne: {
                        SlotType: "",
                        SlotInfo: {}
                    }
                }
            }
        case PageStaticDataTypes.RESET_SECOND_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotTwo: {
                        SlotType: "",
                        SlotInfo: {}
                    }
                }
            }
        case PageStaticDataTypes.RESET_THIRD_DATA_SLOT:
            {
                return {
                    ...state,
                    SlotThree: {
                        SlotType: "",
                        SlotInfo: {}
                    }
                }
            }
        case PageStaticDataTypes.RESET_ALL_SLOT:
            {
                return initialState
            }
        default:
            return state;

    }
}
export default PageStaticDataReducer;