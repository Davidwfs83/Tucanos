import React, { useState } from 'react';
import { connect ,useDispatch} from 'react-redux';
import { UpdateCountry, RemoveCountry } from '../../../../services/ApiServices/AdminApi';
import {
    ObjectDefaultValueCleaner,
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../../services/Utility';
import countryDefault from '../../../../images/defaultCountry.png';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';

let UpdateRemoveCountryPopUp = ({ responseBox, country }) => {

    const [Name, SetName] = useState("");
    const [Latitude, SetLatitude] = useState("");
    const [Longitude, SetLongitude] = useState("");
    const dispatch = useDispatch();

    const ResetState = () => {
        SetName("");
        SetLatitude("");
        SetLongitude("");
    }
    const UpdateButtonOnClick = () => {
        const updatedCountryObj = ObjectDefaultValueCleaner({
            Name,
            Latitude,
            Longitude
        });
        UpdateCountry(updatedCountryObj).then(response => {
            ResetState();
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    const RemoveButtonOnClick = () => {
        RemoveCountry(country.id).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
  
    
    return (
        <div>

            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <h3 className="mb-4 text-center">Update {country.name}</h3>
            <div className="avatar-large mb-3">
                <img alt="" src={country.imgLink === null ? countryDefault : country.imgLink} />
            </div>
            <div className="row row-fix">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Country Name
                        </div>
                        <input type="text" placeholder={country.name} value={Name}
                            onChange={e => SetName(e.target.value)} className="input" />
                    </div>
                </div>
                               
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Longitude
                        </div>
                        <input type="text" value={Longitude} onChange={e => SetLongitude(parseInt(e.target.value))} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Latiude
                        </div>
                        <input type="text" value={Latitude} onChange={e => SetLatitude(parseInt(e.target.value))} className="input" />
                    </div>
                </div>
                            
            </div>
            <div className="control text-center" style={{ color:"#ffffff"} }>
                <a className="button button-brand" onClick={UpdateButtonOnClick}>Update</a>
                <a className="button button-danger" onClick={RemoveButtonOnClick}>Remove</a>
            </div>
        </div>
    )
}

const mapStateToProps = ({ centerPopUp }) => ({
    responseBox: centerPopUp.Response,
    country: centerPopUp.PopUpInfo
});


UpdateRemoveCountryPopUp = connect(mapStateToProps)(UpdateRemoveCountryPopUp);
export default CenterPopUpSkeleton(UpdateRemoveCountryPopUp, "admin3CountryManUpdateRemove");
