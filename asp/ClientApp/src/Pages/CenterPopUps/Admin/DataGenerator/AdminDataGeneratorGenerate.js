import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { GenerateData } from '../../../../services/ApiServices/AdminApi';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import { HidePopUp } from '../../../../redux/CenterPopUp/ceneterpopup.actions';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../../services/Utility';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';




let AdminDataGeneratorGenerate = ({ recordsCount, responseBox}) => {

    const dispatch = useDispatch();
    function createLinesOfRecords() {
        var arr = [];
        var componentKey = 0;
        for (const key in recordsCount) {
            arr.push((
                <div key={componentKey++}>
                    <br />
                    {`${key}: ${recordsCount[key]}`}                    
                </div>
            ));
        }
        return arr;
    }

    return (
        <div>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode }/ >: null}
            <h3 className="mb-4">Are you sure?</h3>
            <div className="pt-1 pb-4">
                WARNING! The Action Youre About To Make Is Irreversible <br />
                And Will Make Permanent Change To The Database, The Entities <br />
                To Be Generated Are The Following: <br />
                {createLinesOfRecords()}
            </div>
            <div className="control text-center">
                <button className="button button-brand"
                    onClick={() => GenerateData(recordsCount).then(response => {
                        ExtractStatusAndMsgForSuccessPopup(response, dispatch);
                    }).catch(error => {
                        ExtractStatusAndMsgForErrorPopup(error, dispatch);
                    })}>
                    Yes! Im Sure
                </button>
                <button className="button button-danger" >On Second Tought...</button>
            </div>
        </div>
    )
}
const mapStateToProps = ({ centerPopUp }) => ({
    responseBox: centerPopUp.Response,
    recordsCount: centerPopUp.PopUpInfo
});


AdminDataGeneratorGenerate = connect(mapStateToProps)(AdminDataGeneratorGenerate);
export default CenterPopUpSkeleton(AdminDataGeneratorGenerate, "admin4DataGenGen");
