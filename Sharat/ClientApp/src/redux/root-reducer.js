import { combineReducers } from "redux";
import AuthReducer from "./Auth/auth.reducer";
import CenterPopUpReducer from "./CenterPopUp/ceneterpopup.reducer";
import { PaginationSetReducer } from './PaginationSet/paginationset.reducer';
import PageStaticDataReducer from './PageStaticData/pagestaticdata.reducer';


export default combineReducers({
    auth: AuthReducer,
    centerPopUp: CenterPopUpReducer,
    paginationSet: PaginationSetReducer,
    staticData: PageStaticDataReducer
})