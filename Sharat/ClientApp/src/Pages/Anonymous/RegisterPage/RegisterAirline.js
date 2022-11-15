import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GetAllCountries } from '../../../services/ApiServices/AnonymousApi';
import newAirlineDefaultImg from '../../../images/newAirline.svg';
import { FigureOutImageSrc, FileToByteArrStingified } from '../../../services/Utility';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import { RequestAirlineCreation } from '../../../services/ApiServices/AnonymousApi';
import { LoadSecond } from '../../../redux/PageStaticData/pagestaticdata.action';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';


const RegisterAirline = () => {

    const dispatch = useDispatch();
    const [Countries, SetCountries] = useState([]);
    const [CompanyName, SetCompanyName] = useState('');
    const [SelectedCountry, SetSelectedCountry] = useState();
    const [Username, SetUsername] = useState('');
    const [Password, SetPassword] = useState('');
    const [Email, SetEmail] = useState('');
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const [ResponseBoxActive, SetResponseBoxActive] = useState(false);
    const [Error, SetError] = useState()
    const [CompanyDescription, SetCompanyDescription] = useState('');

    const ResetState = () => {
        SetCountries([]);
        SetCompanyName('');
        SetSelectedCountry();  
        SetPassword('');
        SetEmail('');
        SetUsername('');
        SetGender(true);
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }


    useEffect(() => {      
        GetAllCountries()
            .then(response => {
                SetCountries(response.data.info);               
                SetSelectedCountry(response.data.info[0].id)
            })
            .catch(error => (<Redirect to={AnonymousNavigation.ErrorPage.Url} />))
    }, []);


    const sumbitOnClick = () => {
        const objs = {
            CompanyName,
            CountryId: SelectedCountry,
            Username,
            Password,
            Email,
            CompanyDescription,
            Img: ImgFile
        };
        RequestAirlineCreation(objs)
            .then(response => {
                
                dispatch(LoadSecond({
                    RespMsg: response.data.info,
                    CompanyName,
                    CountryName: Countries.find(country => country.id === SelectedCountry).name,
                    CompanyDescription,
                    Username,
                    Password,
                    Email,
                    ImgStr
                }, "newCustomer"));
                ResetState();
            })
            .catch(error => {
                console.log(error);
                SetError(error);
                SetResponseBoxActive(true);
            })
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
        <div className="tab-pane fade" id="airline" role="tabpanel">
            <div className="pt-1">
                <div className="registertitle">Airline Sign Up</div>
                <div className="repBox" >
                    {ResponseBoxActive ? <PopUpResponseMessage message={Error.response.data.Message} statusCode={Error.response.status} /> : null}
                </div>
                <div className="imgp" style={{ marginTop: "30px" }}>

                    <img alt="" className="img"
                        src={FigureOutImageSrc(ImgStr, newAirlineDefaultImg, null)} />
                </div>
                <div className="text-center mb-3 p-2">
                    <label className="custom-file-upload" style={{ marginTop: "20px" }} id="InputImg">
                        <input id="imgInput" type="file" accept="image/png, image/gif, image/jpeg" onChange={ImgOnChange} />
                        <i className="fa fa-cloud-upload"></i> {ImageText}
                    </label>
                </div>
                <div className="block">
                    <div className="row row-fix">
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Company Name:
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 20 characters" className="input"
                                    value={CompanyName} onChange={e => SetCompanyName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Country
                                </div>
                                
                                <select className="select"
                                    onChange={e => SetSelectedCountry(parseInt(e.target.value))}>
                                    {
                                        Countries.map(country => 
                                            SelectedCountry === country.id ?
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
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Username
                                </div>
                                <input type="text" placeholder="a-z,A-Z,0-9: 3 - 20 characters" className="input"
                                    value={Username} onChange={e => SetUsername(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Password
                                </div>
                                <input type="text" placeholder="a-z,A-Z,0-9: 3 - 20 characters" className="input"
                                    value={Password} onChange={e => SetPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Email
                                </div>
                                <input type="text" placeholder="example@tucanos.com" className="input"
                                    value={Email} onChange={e => SetEmail(e.target.value)} />
                            </div>
                        </div>                       
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    A Few Words About Your Company (Optional):
                                </div>
                                <textarea className="textarea"
                                    onChange={e => SetCompanyDescription(e.target.value)}
                                    value={CompanyDescription}
                                >
                                </textarea>
                            </div>
                        </div>
                        
                    </div>
                    <div className="control text-center">
                        <button className="button button-brand px-5" onClick={sumbitOnClick}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterAirline;