import React, { useState, useEffect } from 'react';
import { connect, useDispatch} from 'react-redux';
import customerDefault from '../../../../images/defaultCustomer.png';
import { ObjectDefaultValueCleaner } from '../../../../services/Utility';
import { UpdateCustomer, RemoveCustomer } from '../../../../services/ApiServices/AdminApi';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup,
    FigureOutImageSrc,
    FileToByteArrStingified
} from '../../../../services/Utility';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { UpdateSingleEntity, RemoveSingleEntity } from '../../../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData, ResetPopUpData } from '../../../../redux/CenterPopUp/ceneterpopup.actions';

let UpdateRemoveCusPopUp = (props) => {

    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Address, SetAddress] = useState("");
    const [PhoneNo, SetPhoneNo] = useState("");
    const [Points, SetPoints] = useState("");
    const [Email, SetEmail] = useState("");
    const [Username, SetUsername] = useState("");
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

    const ResetState = () => {
        SetFirstName('');
        SetLastName('');
        SetAddress('');
        SetPhoneNo('');
        SetPoints('');
        SetEmail('');
        SetUsername('');
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }

    const UpdateButtonOnClick = () => {
        const updatedCusObj = ObjectDefaultValueCleaner({
            Id: props.customer.id,
            FirstName,
            LastName,
            Address,
            PhoneNo,
            Points,
            UserFk: ObjectDefaultValueCleaner({ Username, Email }),
            UserId: props.customer.userId
        });
        if (ImgFile !== null)
            updatedCusObj.Img = ImgFile;
        UpdateCustomer(updatedCusObj).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);

            //Update Redux Pagaintion Set Slice
            var updatedObj = {};
            if (FirstName !== '')
                updatedObj['firstName'] = FirstName;
            if (LastName !== '')
                updatedObj['lastName'] = LastName;
            if (Address !== '')
                updatedObj['address'] = Address;
            if (PhoneNo !== '')
                updatedObj['phoneNu'] = PhoneNo;
            if (Username !== '')
                updatedObj['userName'] = Username;
            if (Email !== '')
                updatedObj['email'] = Email;
            if (Points !== '')
                updatedObj['points'] = Points;
            if (ImgStr !== null)
                updatedObj['imgStr'] = ImgStr;
            
            dispatch(UpdateSingleEntity(updatedObj, "Customers", props.customer.id, 'id'));

            // Update Center Pop Up Redux Slice
            dispatch(LoadPopUpData(
                { ...props.customer, ...updatedObj }
           ))

            // Reset Component State
            ResetState();

        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    const RemoveButtonOnClick = () => {       
        RemoveCustomer(props.customer.id).then(response => {

            ExtractStatusAndMsgForSuccessPopup(response, dispatch);

            //Update Redux Pagaintion Set Slice
            dispatch(RemoveSingleEntity("Customers", props.customer.id, "id"))
            // Reset Component State
            ResetState();
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    // For Admins level 1 we want to allow only the update feature,
    // for level 2 and higher we allow deleteing aswell
    const MapAdminLevelToAllowedButtons = () => {       
        return props.adminLevel >= 2 ? (
            <div className="control text-center">
                <a className="button btn-update" onClick={UpdateButtonOnClick}>Update</a>
                <a className="button btn-remove" onClick={RemoveButtonOnClick}>Remove</a>
            </div>
        )
            : (
                <div className="control text-center">
                    <a className="button btn-update" onClick={UpdateButtonOnClick}>Update</a>
                    <a className="button btn-remove" >Cancel</a>
                </div>
            );
    }

    useEffect(() => {
        window.$("#admin2CusManUpdateCus").on('hidden.bs.modal', () => {
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
            <h3 className="mb-4 text-center">Customer #{props.customer.id}</h3>
            {props.responseBox.isActive ? <PopUpResponseMessage message={props.responseBox.Msg} statusCode={props.responseBox.StatusCode} /> : null}
            <div className="avatar-large mb-3">
                <img alt=""
                    src={ImgStr === null ? FigureOutImageSrc(props.customer.imgStr, customerDefault, props.customer.imgLink) : `data:image/jpg;base64,${ImgStr}`} />
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
                        <input type="text" placeholder={props.customer.firstName} value={FirstName}
                            onChange={e => SetFirstName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Last Name
                        </div>
                        <input type="text" placeholder={props.customer.lastName} value={LastName}
                            onChange={e => SetLastName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Address
                        </div>
                        <input type="text" placeholder={props.customer.address} value={Address}
                            onChange={e => SetAddress(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Phone
                        </div>
                        <input type="text" placeholder={props.customer.phoneNu} value={PhoneNo}
                            onChange={e => SetPhoneNo(e.target.value)} className="input" />
                    </div>
                </div>               
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Username
                        </div>
                        <input type="text" placeholder={props.customer.userName} value={Username}
                            onChange={e => SetUsername(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" placeholder={props.customer.email} value={Email}
                            onChange={e => SetEmail(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Points
                        </div>
                        <input type="text" placeholder={props.customer.points}
                            value={Points} onChange={e => SetPoints(e.target.value)} className="input" />
                    </div>
                </div>
            </div>
            
            {MapAdminLevelToAllowedButtons()}
        </div>
    )
}

const mapStateToProps = ({ centerPopUp, auth}) => ({
    responseBox: centerPopUp.Response,
    customer: centerPopUp.PopUpInfo,
    adminLevel:  auth.currentUser.userInfo.Level
});


UpdateRemoveCusPopUp = connect(mapStateToProps)(UpdateRemoveCusPopUp);
export default CenterPopUpSkeleton(UpdateRemoveCusPopUp, "admin2CusManUpdateCus") ;
