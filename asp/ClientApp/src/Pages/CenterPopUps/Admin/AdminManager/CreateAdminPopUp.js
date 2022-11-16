import React, { useState, useEffect } from 'react';
import CenterPopUpSkeleton from '../../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { useDispatch, connect } from 'react-redux';
import { CreateAdmin } from '../../../../services/ApiServices/AdminApi';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../../services/Utility';
import PopUpResponseMessage from '../../../../components/CeneterPopUpBase/PopUpResponseMessage';

let CreateAdminPopUp = ({ responseBox }) => {
    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Level, SetLevel] = useState(1);
    const [Username, SetUsername] = useState("");
    const [Password, SetPassword] = useState("");
    const [Email, SetEmail] = useState("");  
    const dispatch = useDispatch();

  
    const sumbitButtonOnClick = () =>
        CreateAdmin(
            {
                FirstName,
                LastName,
                Level,
                Username,
                Password,
                Email,
            }).then(response => {
                ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            }).catch(error => {
                ExtractStatusAndMsgForErrorPopup(error, dispatch);
            })
    return (
        <div>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <h3 className="mb-4 text-center">Create New Admin</h3>
            <div className="text-center mb-3 p-2">
                <a href="#"> Upload avatar</a>
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
                            Level
                        </div>
                        <select className="select" value={Level }
                            onChange={e => SetLevel(parseInt(e.target.value))}>
                            <option key={1} value={1} >1</option>
                            <option key={2} value={2} >2</option>
                            <option key={3} value={3} >3</option>
                        </select>
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
                
            </div>
            <div className="control text-center">
                <button className="button button-brand"
                    onClick={sumbitButtonOnClick}>
                    Create Admin
                </button>
            </div>
        </div>)
}

const mapStateToProps = ({ centerPopUp }) => ({
    responseBox: centerPopUp.Response
});


CreateAdminPopUp = connect(mapStateToProps)(CreateAdminPopUp);

export default CenterPopUpSkeleton(CreateAdminPopUp, "admin4AdminManagerAdd");