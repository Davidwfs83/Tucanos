import React, { useEffect } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { FigureOutImageSrc } from '../../../services/Utility';
import Logo from '../../../images/logo.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';


let InfoPopUp = (props) => {



    useEffect(() => {
        if (!(props.timeInSec === undefined)) {
            const timer = setTimeout(() => {
                props.afterTimeOutCallback();
                window.$('#InfoPopUp').modal('hide');
            }, props.timeInSec * 1000);
            return () => clearTimeout(timer);
        }
    });
    return (
        <div>
            <h3 className="mb-4">{props.title}</h3>
            {
                props.imgActive ?
                    (
                        <div className="avatar-small mb-1">

                            <img alt="" src={FigureOutImageSrc(props.imgStr, Logo,null)} />
                        </div>
                    )
                    :
                    null
            }           
            <div className="pt-1 pb-4">
                {props.infoText}
            </div>
        </div>
    )
}

const mapStateToProps = ({ centerPopUp }) => ({
    title: centerPopUp.PopUpInfo.title,
    infoText: centerPopUp.PopUpInfo.infoText,
    // 0 means indefinetly
    timeInSec: centerPopUp.PopUpInfo.timeInSec,
    imgActive: centerPopUp.PopUpInfo.imgActive,
    imgStr: centerPopUp.PopUpInfo.imgStr,
    afterTimeOutCallback: centerPopUp.PopUpInfo.afterTimeOutCallback
});

InfoPopUp = connect(mapStateToProps)(InfoPopUp);
export default CenterPopUpSkeleton(InfoPopUp, "InfoPopUp")