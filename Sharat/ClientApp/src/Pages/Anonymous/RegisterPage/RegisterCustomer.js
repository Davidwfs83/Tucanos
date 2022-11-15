import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { CreateCustomer } from '../../../services/ApiServices/AnonymousApi';
import { FigureOutImageSrc, FileToByteArrStingified } from '../../../services/Utility';

import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';
import newCustomerDefaultImg from '../../../images/newCustomer.png';
import { LoadFirst } from '../../../redux/PageStaticData/pagestaticdata.action';




const RegisterCustomer = () => {
    const dispatch = useDispatch();

    const [FirstName, SetFirstName] = useState('');
    const [LastName, SetLastName] = useState('');
    const [Address, SetAddress] = useState('');
    const [PhoneNo, SetPhoneNo] = useState('');
    const [CreditCard, SetCreditCard] = useState('');
    const [Gender, SetGender] = useState(true);
    const [Username, SetUsername] = useState('');
    const [Password, SetPassword] = useState('');
    const [Email, SetEmail] = useState('');
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const [ResponseBoxActive, SetResponseBoxActive] = useState(false);
    const [Error, SetError] = useState()




    const ResetState = () => {
        SetFirstName('');
        SetLastName('');
        SetAddress('');
        SetPhoneNo('');
        SetCreditCard('');
        SetPassword('');
        SetEmail('');
        SetUsername('');
        SetGender(true);
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }

    const sumbitOnClick = () => {
        CreateCustomer({
            FirstName,
            LastName,
            Address,
            PhoneNo,
            CreditCard,
            Gender,
            Username,
            Password,
            Email,
            Img: ImgFile
        }).then(response => {
            console.log(response);
            dispatch(LoadFirst({
                RespMsg: response.data.info,
                FirstName,
                LastName,
                Address,
                PhoneNo,
                CreditCard,
                Gender,
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
        <div className="tab-pane fade show active" id="customer" role="tabpanel">
            <div className="pt-1">
                <div className="registertitle">Customer Sign Up</div>
                <div className="repBox" >
                    {ResponseBoxActive ? <PopUpResponseMessage message={Error.response.data.Message} statusCode={Error.response.status} /> : null}
                    </div>
                <div className="imgp" style={{ marginTop: "30px" }}>

                    <img alt="" className= "img"
                        src={FigureOutImageSrc(ImgStr, newCustomerDefaultImg, null)} />
                </div>
                <div className="text-center mb-3 p-2">
                    <label className="custom-file-upload" style={{ marginTop:"20px" }} id="InputImg">
                        <input id="imgInput" type="file" accept="image/png, image/gif, image/jpeg" onChange={ImgOnChange} />
                        <i className="fa fa-cloud-upload"></i> {ImageText}
                    </label>
                </div>
                <div className="block">
                    <div className="row row-fix">
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    First Name
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 10 characters" className="input"
                                    value={FirstName} onChange={e => SetFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Last Name
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 20 characters" className="input"
                                    value={LastName} onChange={e => SetLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Address
                                </div>
                                <input type="text" placeholder="a-z,A-Z,0-9: 3 - 20 characters" className="input"
                                    value={Address} onChange={e => SetAddress(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Phone number
                                </div>
                                <input type="text" placeholder="0-9: 7-20 characters" className="input"
                                    value={PhoneNo} onChange={e => SetPhoneNo(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Credit card
                                </div>
                                <input type="text" placeholder="0-9: 7 - 25 characters" className="input"
                                    value={CreditCard} onChange={e => SetCreditCard(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Gender
                                </div>
                                <select className="select" value={Gender ? 'Male' : 'Female'}
                                    onChange={e => SetGender(e.target.value === 'Male')}>
                                    <option value={'Male'}>Male</option>
                                    <option value={'Female'}>Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    User name
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 20 characters" className="input"
                                    value={Username} onChange={e => SetUsername(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Password
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 20 characters" className="input"
                                    value={Password} onChange={e => SetPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix">
                            <div className="field">
                                <div className="field-cap">
                                    Email
                                </div>
                                <input type="text" placeholder="a-z,A-Z: 3 - 20 characters" className="input"
                                    value={Email} onChange={e => SetEmail(e.target.value)} />
                            </div>
                        </div>                        
                    </div>
                    <div className="control text-center">
                        <button className="button btn-create" onClick={sumbitOnClick}>Submit</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RegisterCustomer;