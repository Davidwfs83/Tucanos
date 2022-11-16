import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { ClearData } from '../../../../services/ApiServices/AdminApi';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../../services/Utility';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';

let AdminDataGeneratorClear = ({responseBox }) => {
    const dispatch = useDispatch();
    return (
        <div>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <h3 className="mb-4">Are you sure?</h3>
            <div className="pt-1 pb-4">
                WARNING! The Action Your'e About to Take <br />
                Will Wipe Out The Entire Database, Please Confirm <br />
                If You Wish To Procced
            </div>
            <div className="control text-center">
                <button className="button button-brand" onClick={() => ClearData().then(response => {
                    ExtractStatusAndMsgForSuccessPopup(response, dispatch);
                }).catch(error => {
                    ExtractStatusAndMsgForErrorPopup(error, dispatch);
                })}>
                    Yes! Im Sure
                </button>
                <button className="button button-danger">On Second Tought...</button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ centerPopUp }) => ({
    responseBox: centerPopUp.Response
});


AdminDataGeneratorClear = connect(mapStateToProps)(AdminDataGeneratorClear);

export default CenterPopUpSkeleton(AdminDataGeneratorClear, "admin4DataGenClear")
