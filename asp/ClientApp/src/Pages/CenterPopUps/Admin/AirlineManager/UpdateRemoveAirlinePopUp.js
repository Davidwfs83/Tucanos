import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import airlineDefault from '../../../../images/defaultAirline.png';
import { UpdateAirline, RemoveAirline } from '../../../../services/ApiServices/AdminApi';
import {
    ObjectDefaultValueCleaner,
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup,
    isEmptyObject,
    FigureOutImageSrc,
    FileToByteArrStingified
} from '../../../../services/Utility';
import { LoadPopUpData } from '../../../../redux/CenterPopUp/ceneterpopup.actions';
import { UpdateSingleEntity, RemoveSingleEntity } from '../../../../redux/PaginationSet/paginationset.actions';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';

let UpdateRemoveAirlinePopUp = ({ responseBox, airline, adminLevel, countries, popInfoType}) => {

    const [CompanyName, SetCompanyName] = useState("");
    const [CountryId, SetCountryId] = useState("");
    const [Email, SetEmail] = useState("");
    const [Username, SetUsername] = useState("");
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

    const ResetState = () => {
        SetCompanyName("");
        SetEmail("");
        SetUsername("");
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }


    // Load the current country of the airline as the first placeholder for the country field
    useEffect(() => {
        if (!isEmptyObject(airline) && !(airline === undefined) && popInfoType === 'Airline') {
            SetCountryId(airline.countryId.toString())
        }
    }, [airline]);


    const UpdateButtonOnClick = () => {
        const updatedAirlineObj = ObjectDefaultValueCleaner({
            CompanyId: airline.airlineId,
            CompanyName,
            CountryId: parseInt(CountryId),
            Email,
            Username,
            UserId: airline.userId
        });
        if (ImgFile !== null)
            updatedAirlineObj.Img = ImgFile;
        UpdateAirline(updatedAirlineObj).then(response => {            
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);

            //Update Redux Pagaintion Set Slice
            var updatedObj = {};
            if (CompanyName !== '')
                updatedObj['airlineName'] = CompanyName;
            if (CountryId !== '')
                updatedObj['countryId'] = parseInt(CountryId);
           
            if (Username !== '')
                updatedObj['userName'] = Username;
            if (Email !== '')
                updatedObj['email'] = Email;           
            if (ImgStr !== null)
                updatedObj['imgStr'] = ImgStr;
            
            dispatch(UpdateSingleEntity(updatedObj, "Airlines", airline.airlineId, 'airlineId'));

            // Update Center Pop Up Redux Slice
            dispatch(LoadPopUpData(
                { ...airline, ...updatedObj }
            ))
            // Reset Component State
            ResetState();
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }


    const RemoveButtonOnClick = () => {
        RemoveAirline(airline.airlineId).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            //Update Redux Pagaintion Set Slice
            dispatch(RemoveSingleEntity("Airlines", airline.airlineId, "airlineId"))
            // Reset Component State
            ResetState();
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    const CancelPopUpOnClick = () => {
        window.$('admin2AirlineManUpdateAirline').modal('hide')
    }
    // For Admins level 1 we want to allow only the update feature,
    // for level 2 and higher we allow deleteing aswell
    const MapAdminLevelToAllowedButtons = () => {
        return adminLevel >= 2 ? (
            <div className="control text-center">
                <a  className="button btn-update" onClick={UpdateButtonOnClick}>Update</a>
                <a  className="button btn-remove" onClick={RemoveButtonOnClick}>Remove</a>
            </div>
        )
            : (
                <div className="control text-center">
                    <a className="button btn-update" onClick={UpdateButtonOnClick}>Update</a>
                    <a className="button btn-remove" onClick={CancelPopUpOnClick} >Cancel</a>
                </div>
            );
    }
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
            <h3 className="mb-4 text-center">Airline #{airline.airlineId}</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-large mb-3">
                <img alt=""
                    src={ImgStr === null ? FigureOutImageSrc(airline.imgStr, airlineDefault, airline.imgLink) : `data:image/jpg;base64,${ImgStr}`} />
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
                            Company Name
                        </div>
                        <input type="text" placeholder={airline.airlineName} value={CompanyName}
                            onChange={e => SetCompanyName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Country
                        </div>
                        <select className="select" value={CountryId}
                            onChange={e => SetCountryId(e.target.value)}>
                            {
                                countries.map(country => (<option
                                    key={country.id}
                                    value={country.id}
                                >
                                    {country.name}
                                </option>)
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
                        <input type="text" placeholder={airline.username} value={Username}
                            onChange={e => SetUsername(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" placeholder={airline.email} value={Email}
                            onChange={e => SetEmail(e.target.value)} className="input" />
                    </div>
                </div>               
            </div>
            {MapAdminLevelToAllowedButtons()}
        </div>
    )
}

const mapStateToProps = ({ centerPopUp, paginationSet, auth }) => ({
    responseBox: centerPopUp.Response,
    airline: centerPopUp.PopUpInfo,
    popInfoType: centerPopUp.PopUpType,
    countries: paginationSet.Entities.Countries,
    adminLevel: auth.currentUser.userInfo.Level
});


UpdateRemoveAirlinePopUp = connect(mapStateToProps)(UpdateRemoveAirlinePopUp);
export default CenterPopUpSkeleton(UpdateRemoveAirlinePopUp, "admin2AirlineManUpdateAirline");
