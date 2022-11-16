import React , { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import defaultCustomerImg from '../../../images/defaultCustomer.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { UpdateMyDetails } from '../../../services/ApiServices/CustomerApi';
import {
    ObjectDefaultValueCleaner,
    FileToByteArrStingified,
    FigureOutImageSrc,
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../services/Utility';
import { LoadFirst } from '../../../redux/PageStaticData/pagestaticdata.action';
import { UpdateLoggedUser } from '../../../redux/Auth/auth.actions';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';


let CustomerMyDetailsUpdate = ({ responseBox, customer }) => {
    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Address, SetAddress] = useState("");
    const [PhoneNu, SetPhoneNu] = useState("");
    const [CreditCard, SetCreditCard] = useState("");
    const [Email, SetEmail] = useState("");
    const [Username, SetUsername] = useState("");
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

    // Sadly no built-in way in react to do this
    const ResetState = () => {
        SetFirstName('');
        SetLastName('');
        SetAddress('');
        SetPhoneNu('');
        SetCreditCard('');
        SetUsername('');
        SetEmail('');
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }


    const updateDetails = () => {
        const updatedCusObj = ObjectDefaultValueCleaner({
            CustomerId: customer.CustomerId,
            FirstName,
            LastName,
            Address,
            PhoneNu,           
            CreditCard,
            Username,
            Email
        });
        if (ImgFile !== null)
            updatedCusObj.Img = ImgFile;
        UpdateMyDetails(updatedCusObj).then(response => {
            // Log Response Msg
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            // Update Redux Static First Slot(Which Holds The Customer Info For This Page)
            dispatch(LoadFirst({
                ...customer, ...ObjectDefaultValueCleaner({                    
                    FirstName,
                    LastName,
                    Address,
                    PhoneNu,
                    CreditCard,
                    Username,
                    Email,
                    ImgStr
                })
            }));
            // Update The Redux Auth Slice Which Holds The Logged In User Info For The Entire App
            dispatch(UpdateLoggedUser(
                {
                    ...ObjectDefaultValueCleaner(
                        {
                            FirstName,
                            LastName,
                            Address,
                            PhoneNo: PhoneNu,
                            Credit_Card_No: CreditCard
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
        window.$("#customerUpdateDetails").on('hidden.bs.modal', () => {
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
                <img alt="" src=
                    {ImgStr === null ? FigureOutImageSrc(customer.ImgStr, defaultCustomerImg, customer.ImgLink) : `data:image/jpg;base64,${ImgStr}`} />
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
                            First Name
                        </div>
                        <input type="text" placeholder={customer.FirstName} value={FirstName}
                            onChange={e => SetFirstName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Last Name
                        </div>
                        <input type="text" placeholder={customer.LastName} value={LastName}
                            onChange={e => SetLastName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Address
                        </div>
                        <input type="text" placeholder={customer.Address} value={Address}
                            onChange={e => SetAddress(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Phone
                        </div>
                        <input type="text" placeholder={customer.PhoneNu} value={PhoneNu}
                            onChange={e => SetPhoneNu(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            CreditCard
                        </div>
                        <input type="text" placeholder={customer.CreditCard} value={CreditCard}
                            onChange={e => SetCreditCard(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Username
                        </div>
                        <input type="text" placeholder={customer.UserName} value={Username}
                            onChange={e => SetUsername(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" placeholder={customer.Email} value={Email}
                            onChange={e => SetEmail(e.target.value)} className="input" />
                    </div>
                </div>               
                
            </div>
            <div className="control text-center">
                <a className="button btn-update" onClick={updateDetails}>Update</a>
                
            </div>
            
        </div>

    )

}


const mapStateToProps = ({ centerPopUp, staticData }) => ({
    responseBox: centerPopUp.Response,
    customer: staticData.SlotOne.SlotInfo
});
CustomerMyDetailsUpdate = connect(mapStateToProps)(CustomerMyDetailsUpdate);
export default CenterPopUpSkeleton(CustomerMyDetailsUpdate, "customerUpdateDetails");
