import React, { useState, useEffect } from 'react';
import CenterPopUpSkeleton from '../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { useDispatch, connect } from 'react-redux';
import { CreateAirline } from '../../../../services/ApiServices/AdminApi';
import AirlineDefaultImg from '../../../../images/newAirline.svg';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup,
    FigureOutImageSrc,
    FileToByteArrStingified,
    isEmptyArr
} from '../../../../services/Utility';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';

let CreateAirlinePopUp = ({ responseBox, countries }) => {
    const [CompanyName, SetCompanyName] = useState("");
    const [CountryId, SetCountryId] = useState();
    const [Password, SetPassword] = useState("");
    const [Email, SetEmail] = useState("");
    const [Username, SetUsername] = useState("");
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (Array.isArray(countries) && !isEmptyArr(countries))
            SetCountryId(countries[0].id);

    }, [countries]);


    const ResetState = () => {
        SetCompanyName('');
        SetCountryId('');
        
        SetPassword('');
        SetEmail('');
        SetUsername('');
        
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }

    useEffect(() => {
        window.$('#admin2AirlineManagerAdd').on('hidden.bs.modal', () => {
            ResetState();
            
        });
    }, []);


    const sumbitButtonOnClick = () =>
        CreateAirline(
            {
                CompanyName,
                CountryId,
                Password,
                Email,
                Username,
                Email,
                Img: ImgFile
            }).then(response => {
                
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
            <h3 className="mb-4 text-center">Create Airline</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}            
            <div className="avatar-small mb-1">

                <img alt=""
                    src={FigureOutImageSrc(ImgStr, AirlineDefaultImg, null)} />
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
                            Airline Name
                        </div>
                        <input type="text" value={CompanyName} onChange={e => SetCompanyName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Airline Country
                        </div>
                        <select className="select" 
                            onChange={e => SetCountryId(parseInt(e.target.value))}>
                            {
                                countries.map(country => (
                                    <option
                                        key={country.id}
                                        value={country.id}
                                    >
                                        {country.name}
                                    </option>
                                )
                                )
                            }
                        </select>
                    </div>
                </div>

                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Username
                        </div>
                        <input type="text" value={Username} onChange={e => SetUsername(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Password
                        </div>
                        <input type="text" value={Password} onChange={e => SetPassword(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" value={Email} onChange={e => SetEmail(e.target.value)} className="input" />
                    </div>
                </div>

            </div>
            <div className="control text-center">
                <button className="button btn-create"
                    onClick={sumbitButtonOnClick}>
                    Create
                </button>
            </div>
        </div>)
}

const mapStateToProps = ({ centerPopUp, paginationSet }) => ({
    responseBox: centerPopUp.Response,
    countries: paginationSet.Entities.Countries
});


CreateAirlinePopUp = connect(mapStateToProps)(CreateAirlinePopUp);

export default CenterPopUpSkeleton(CreateAirlinePopUp, "admin2AirlineManagerAdd");