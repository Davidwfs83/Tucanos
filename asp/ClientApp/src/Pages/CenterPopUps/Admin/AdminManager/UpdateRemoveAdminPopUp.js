import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import adminDefault from '../../../../images/defaultAdmin.png';
import {
    ObjectDefaultValueCleaner,
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../../services/Utility';
import { UpdateAdmin, RemoveAdmin } from '../../../../services/ApiServices/AdminApi';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';
import CenterPopUpSkeleton from './../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';

let UpdateRemoveAdminPopUp = ({ responseBox, admin, adminLevel }) => {

    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Level, SetLevel] = useState(admin.level);
    const [Username, SetUsername] = useState("");
    const [Email, SetEmail] = useState("");
    const dispatch = useDispatch();

    const ResetState = () => {
        SetFirstName("");
        SetLastName("");
        SetEmail("");
        SetUsername("");
    }
    const UpdateButtonOnClick = () => {
        const updatedAdminObj = ObjectDefaultValueCleaner({
            AdminId: admin.adminId,
            FirstName,
            LastName,
            Level,
            Email,
            Username
        });
        UpdateAdmin(updatedAdminObj).then(response => {
            ResetState();
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    const RemoveButtonOnClick = () => {
        RemoveAdmin(admin.adminId).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }).catch(error => {
            console.log(error);
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    
    return (
        <div>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-large mb-3">
                <img alt="" src={adminDefault} />
            </div>
            <div className="row row-fix">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                           First Name
                        </div>
                        <input type="text" placeholder={admin.firstName} value={FirstName}
                            onChange={e => SetFirstName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Last Name
                        </div>
                        <input type="text" value={LastName} placeholder={admin.lastName}
                            onChange={e => SetLastName(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Level
                        </div>
                        <select className="select"
                            onChange={e => SetLevel(parseInt(e.target.value))}>
                            <option key={1} value={1}>1</option>
                            <option key={2} value={2}>2</option>
                            {
                                adminLevel > 3 ?
                                    (<option key={3} value={3}>3</option>)
                                    : null
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Username
                        </div>
                        <input type="text" placeholder={admin.username} value={Username}
                            onChange={e => SetUsername(e.target.value)} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Email
                        </div>
                        <input type="text" placeholder={admin.email} value={Email}
                            onChange={e => SetEmail(e.target.value)} className="input" />
                    </div>
                </div>               
            </div>
            <div className="control text-center">
                <a className="button button-brand" onClick={UpdateButtonOnClick}>Update</a>
                <a className="button button-danger" onClick={RemoveButtonOnClick}>Remove</a>
            </div>
        </div>
    )
}

const mapStateToProps = ({ centerPopUp, auth }) => ({
    responseBox: centerPopUp.Response,
    admin: centerPopUp.PopUpInfo,
    adminLevel: auth.currentUser.userInfo.Level   
});


UpdateRemoveAdminPopUp = connect(mapStateToProps)(UpdateRemoveAdminPopUp);
export default CenterPopUpSkeleton(UpdateRemoveAdminPopUp, "admin2AdminManUpdateAdmin");
