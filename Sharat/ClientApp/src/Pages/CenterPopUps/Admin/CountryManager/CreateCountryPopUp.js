import React, { useState, useEffect } from 'react';
import CenterPopUpSkeleton from '../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { useDispatch, connect } from 'react-redux';
import defaultCountryImg from '../../../../images/defaultCountry.png';
import { CreateCountry } from '../../../../services/ApiServices/AdminApi';
import { ResetPopUpData } from '../../../../redux/CenterPopUp/ceneterpopup.actions';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup,
    FigureOutImageSrc,
    FileToByteArrStingified
    
} from '../../../../services/Utility';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';

let CreateCountryPopUp = ({ responseBox}) => {
    const [Name, SetName] = useState("");
    const [Latitude, SetLatitude] = useState("");
    const [Longitude, SetLongitude] = useState("");
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();
    const ResetState = () => {
        SetName('');
        SetLatitude('');
        SetLongitude('');        
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }

    useEffect(() => {
        window.$('#admin3CountryManagerAdd').on('hidden.bs.modal', () => {
            ResetState();
            dispatch(ResetPopUpData());
        });
    }, []);


    const sumbitButtonOnClick = () =>
        CreateCountry(
            {
                Name,
                Latitude: parseInt(Latitude),
                Longitude: parseInt(Longitude),
                Img: ImgFile
            }).then(response => {;
                ExtractStatusAndMsgForSuccessPopup(response, dispatch);
                ResetState();
            }).catch(error => {
                ExtractStatusAndMsgForErrorPopup(error, dispatch);
            })

    const ImgOnChange = e => {
        let file = e.target.files[0];
        SetImgFile(file);
        FileToByteArrStingified(file, imgString => {
            SetImgStr(imgString);
            /*window.$("#imgInput").val(null);*/
        });
        SetImageText(file.name);
    }

    return (
        <div>
            <h3 className="mb-4 text-center">Create New Country</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}           
            <div className="avatar-small mb-1">

                <img alt=""
                    src={FigureOutImageSrc(ImgStr, defaultCountryImg, null)} />
            </div>
            <div className="text-center mb-3 p-2">
                <label className="custom-file-upload" id="InputImg">
                    <input id="imgInput" type="file" accept="image/png, image/gif, image/jpeg" onChange={ImgOnChange} />
                    <i className="fa fa-cloud-upload"></i> {ImageText}
                </label>
            </div>
            <div className="row row-fix">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Country Name
                        </div>
                        <input type="text" value={Name} onChange={e => SetName(e.target.value)} className="input" />
                    </div>
                </div>                                             
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Longitude
                        </div>
                        <input type="text" value={Longitude} onChange={e => SetLongitude(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Latiude
                        </div>
                        <input type="text" value={Latitude} onChange={e => SetLatitude(e.target.value)} className="input" />
                    </div>
                </div>
               
                
            </div>
            <div className="control text-center">
                <button className="button button-brand"
                    onClick={sumbitButtonOnClick}>
                    Create Country
                </button>
            </div>
        </div>)
}

const mapStateToProps = ({ centerPopUp}) => ({
    responseBox: centerPopUp.Response
});


CreateCountryPopUp = connect(mapStateToProps)(CreateCountryPopUp);

export default CenterPopUpSkeleton(CreateCountryPopUp, "admin3CountryManagerAdd");