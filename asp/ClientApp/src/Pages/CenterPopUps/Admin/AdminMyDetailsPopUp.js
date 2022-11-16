import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import AdminDefaultImage from '../../../images/defaultAdmin.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { UpdateMyDetails } from '../../../services/ApiServices/AdminApi';
import {
    ObjectDefaultValueCleaner,
    FigureOutImageSrc,
    ExtractStatusAndMsgForErrorPopup,
    ExtractStatusAndMsgForSuccessPopup,
    FileToByteArrStingified
} from '../../../services/Utility';
import { LoadFirst } from '../../../redux/PageStaticData/pagestaticdata.action';
import { UpdateLoggedUser } from '../../../redux/Auth/auth.actions';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';


let AdminMyDetailsPopUp = ({ responseBox, admin }) => {

    const [Firstname, SetFirstname] = useState('');
    const [Lastname, SetLastname] = useState('');
    const [Username, SetUsername] = useState('');
    const [Email, SetEmail] = useState('');
    const [ImageText, SetImageText] = useState('Upload Image');
    const [ImgStr, SetImgStr] = useState(null);
    const [ImgFile, SetImgFile] = useState(null);
    const dispatch = useDispatch();

    // Sadly no built-in way in react to do this
    const ResetState = () => {
        SetFirstname('');
        SetLastname('');
        SetUsername('');
        SetEmail('');
        SetImageText('Upload Image');
        SetImgStr(null);
        SetImgFile(null);
    }


    const updateDetails = () => {
        const updatedAdminObj = ObjectDefaultValueCleaner({
            AdminId: admin.AdminId,
            Firstname,
            Lastname,
            Username,
            Email
        });
        if (ImgFile !== null)
            updatedAdminObj.Img = ImgFile;
        UpdateMyDetails(updatedAdminObj).then(response => {
            // Log Response Msg
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            // Update Redux Static First Slot(Which Holds The Admin Info For This Page)
            dispatch(LoadFirst({
                ...admin, ...ObjectDefaultValueCleaner({
                    AdminId: admin.AdminId,
                    Firstname,
                    Lastname,
                    Username,
                    Email,
                    ImgStr
                })
            }));
            // Update The Redux Auth Slice Which Holds The Logged In User Info For The Entire App
            dispatch(UpdateLoggedUser(
                {
                    ...ObjectDefaultValueCleaner({ FirstName: Firstname, LastName: Lastname }),
                    UserFk: { ...ObjectDefaultValueCleaner({ Username, Email }) }
                }, ImgStr));
            // Reset Component State
            ResetState();
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }

    useEffect(() => {
        window.$('#adminUpdateDetails').on('hidden.bs.modal', () => {
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
            <h3 className="mb-4 text-center">Update Info</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">

                <img alt=""
                    src={ImgStr === null ? FigureOutImageSrc(admin.ImgStr, AdminDefaultImage, admin.ImgLink) : `data:image/jpg;base64,${ImgStr}`} />
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
                        <input type="text" placeholder={admin.Firstname} className="input" value={Firstname}
                            onChange={e => SetFirstname(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Last Name
                        </div>
                        <input type="text" placeholder={admin.Lastname} className="input" value={Lastname}
                            onChange={e => SetLastname(e.target.value)} />
                    </div>
                </div>


                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Username
                        </div>
                        <input type="text" placeholder={admin.Username} className="input" value={Username}
                            onChange={e => SetUsername(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" placeholder={admin.Email} className="input" value={Email}
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

const mapStateToProps = ({ staticData, centerPopUp }) => ({
    responseBox: centerPopUp.Response,
    admin: staticData.SlotOne.SlotInfo
});
AdminMyDetailsPopUp = connect(mapStateToProps)(AdminMyDetailsPopUp);
export default CenterPopUpSkeleton(AdminMyDetailsPopUp, "adminUpdateDetails");
