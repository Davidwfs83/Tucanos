import React, { useState, useEffect } from 'react';
import CenterPopUpSkeleton from '../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { useDispatch , connect } from 'react-redux';
import { CreateCustomer } from '../../../../services/ApiServices/AnonymousApi';
import newCustomerDefaultImg from '../../../../images/newCustomer.png';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup,
    FigureOutImageSrc,
    FileToByteArrStingified
} from '../../../../services/Utility';
import { ResetPopUpData } from '../../../../redux/CenterPopUp/ceneterpopup.actions';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';

let CreateCusPopUp = ({ responseBox}) => {
    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Address, SetAddress] = useState("");
    const [PhoneNo, SetPhoneNo] = useState("");
    const [CreditCard, SetCreditCard] = useState("");
    const [Password, SetPassword] = useState("");
    const [Email, SetEmail] = useState("");
    const [Username, SetUsername] = useState("");
    const [Gender, SetGender] = useState(true);
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

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

    useEffect(() => {
        window.$('#admin2CustomerManagerAdd').on('hidden.bs.modal', () => {
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
            <h3 className="mb-4 text-center">Create Customer</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">

                <img alt=""
                    src={FigureOutImageSrc(ImgStr, newCustomerDefaultImg, null)} />
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
                            First Name
                        </div>
                        <input type="text" value={FirstName} onChange={e => SetFirstName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Last Name
                        </div>
                        <input type="text" value={LastName} onChange={e => SetLastName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Address
                        </div>
                        <input type="text" value={Address} onChange={e => SetAddress(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Phone
                        </div>
                        <input type="text" value={PhoneNo} onChange={e => SetPhoneNo(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Credit Card
                        </div>
                        <input type="text" value={CreditCard} onChange={e => SetCreditCard(e.target.value)} className="input" />
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
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Gender
                        </div>
                        <select className="select" value={Gender ? 'male' : 'female'} onChange={e => SetGender(e.target.value === 'male')}>
                            <option value={"male"}>Male</option>
                            <option value={"female"}>Female</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="control text-center">
                <button className="button btn-create"
                    onClick={() => {
                        CreateCustomer
                            (
                                {
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
                                    ExtractStatusAndMsgForSuccessPopup(response, dispatch);
                                    ResetState();
                                }).catch(error => {
                                    ExtractStatusAndMsgForErrorPopup(error, dispatch);
                                });
                    }
                    }>
                    Create
                </button>
            </div>
        </div>)
}

const mapStateToProps = ({ centerPopUp }) => ({
    responseBox: centerPopUp.Response
});


CreateCusPopUp = connect(mapStateToProps)(CreateCusPopUp);

export default CenterPopUpSkeleton(CreateCusPopUp, "admin2CustomerManagerAdd");