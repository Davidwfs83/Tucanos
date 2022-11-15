import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import AirlineDefaultImage from '../../../images/defaultAirline.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { UpdateAirline } from '../../../services/ApiServices/AirlineApi';
import { GetAllCountries } from '../../../services/ApiServices/AnonymousApi';
import {
    ObjectDefaultValueCleaner,
    ExtractStatusAndMsgForErrorPopup,
    ExtractStatusAndMsgForSuccessPopup,
    FigureOutImageSrc,   
    FileToByteArrStingified,
    isEmptyObject
} from '../../../services/Utility';
import { UpdateLoggedUser } from '../../../redux/Auth/auth.actions';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';
import { LoadFirst } from '../../../redux/PageStaticData/pagestaticdata.action';
import { ActiveResponseBox, ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';


let AirlineUpdateDetailsPopUp = ({ responseBox, airline }) => {
    const [Countries, SetCountries] = useState([]);
    const [AirlineName, SetAirlineName] = useState('');
    const [CountryId, SetCountryId] = useState(airline.CountryId);
    const [CountryName, SetCountryName] = useState(airline.CountryName);
    const [Username, SetUsername] = useState('');
    const [Email, SetEmail] = useState('');
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

   
    const ResetState = () => {
        SetAirlineName('');       
        SetUsername('');
        SetEmail('');
        SetImageText('Upload Image');
        SetCountryName('');
        SetImgStr(null);
        SetImgFile(null);
    }

    // Load the current country of the airline as the first placeholder for the country field
    useEffect(() => {
        if (!isEmptyObject(airline) && !(airline === undefined)) {
            SetCountryId(airline.CountryId)
        }
    }, [airline.CountryId]);

    useEffect(() => {
        GetAllCountries()
            .then(response => SetCountries(response.data.info))
            .catch(error => {
                dispatch(ActiveResponseBox(error.response.status, error.message));
            });
    }, [])

    const updateDetails = () => {
        const updatedAirlineObj = ObjectDefaultValueCleaner({
            AirlineId: airline.AirlineId,
            AirlineName,
            CountryId,
            Username,
            Email
        });
        if (ImgFile !== null)
            updatedAirlineObj.Img = ImgFile;
        
        UpdateAirline(updatedAirlineObj).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            // Update Redux Static First Slot(Which Holds The Airline Info For This Page)
            dispatch(LoadFirst({
                ...airline, ...ObjectDefaultValueCleaner({
                    AirlineId: airline.AirlineId,
                    AirlineName,
                    CountryId: (CountryId !== airline.CountryId ? CountryId : 0),
                    CountryName: CountryName,
                    Username,
                    Email,
                    ImgStr
                })
            }));
            // Update The Redux Auth Slice Which Holds The Logged In User Info For The Entire App
            dispatch(UpdateLoggedUser(
                {
                    ...ObjectDefaultValueCleaner({
                        Name: AirlineName, CountryFk: CountryId !== airline.CountryId ?
                            { Id: CountryId, Name: CountryName }: 0 
                    }),
                    UserFk: { ...ObjectDefaultValueCleaner({ Username, Email }) }
                }, ImgStr));
            // Reset Component State
            ResetState();
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }

    useEffect(() => {
        window.$('#airlineUpdateDetails').on('hidden.bs.modal', () => {
            ResetState();
            dispatch(ResetPopUpData());
        });
    }, []);
   

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
            <h3 className="mb-4 text-center">Update info</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">
            <img alt=""
                    src={ImgStr === null ? FigureOutImageSrc(airline.ImgStr, AirlineDefaultImage, airline.ImgLink) : `data:image/jpg;base64,${ImgStr}`} />
            </div>

            <div className="text-center mb-3 p-2">
                <label className="custom-file-upload" id="InputImg">
                    <input type="file" accept="image/png, image/gif, image/jpeg" onChange={ImgOnChange} />
                    <i className="fa fa-cloud-upload"></i> {ImageText}
                </label>
            </div>

            <div className="row row-fix">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Name
										</div>
                        <input type="text" placeholder={airline.AirlineName} className="input" value={AirlineName}
                            onChange={e => SetAirlineName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Country
										</div>
                        <select className="select"
                            onChange={e => {
                                SetCountryId(parseInt(e.target.value));
                                SetCountryName(Countries.find(country => country.id === parseInt(e.target.value)).name)
                            }
                            }>
                            {
                                Countries.map(country =>
                                    CountryId === country.id ?
                                        (<option
                                            key={country.id}
                                            value={country.id}
                                            selected
                                        >
                                            {country.name}
                                        </option>) :
                                        (<option
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
                        <input type="text" placeholder={airline.Username} className="input" value={Username}
                        onChange={e => SetUsername(e.target.value)}/>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
										</div>
                        <input type="text" placeholder={airline.Email} className="input" value={Email}
                            onChange={e => SetEmail(e.target.value)} />
                    </div>
                </div>
                

            </div>
            <div className="control text-center">

                <a className="button btn-update" onClick={updateDetails}>Update</a>
               

            </div>

        </div>

    )

}


const mapStateToProps = ({ staticData,centerPopUp }) => ({
    responseBox: centerPopUp.Response,
    airline: staticData.SlotOne.SlotInfo
});
AirlineUpdateDetailsPopUp = connect(mapStateToProps)(AirlineUpdateDetailsPopUp);
export default CenterPopUpSkeleton(AirlineUpdateDetailsPopUp, "airlineUpdateDetails");
