import React, { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import AdminDefaultImg from '../../images/defaultAdmin.png';
import { GetMyDetails } from '../../services/ApiServices/AdminApi';
import PageTitle from '../../components/PageTitle';
import { LoadFirst, ResetAll } from '../../redux/PageStaticData/pagestaticdata.action';
import { FigureOutImageSrc } from '../../services/Utility';

const AdminMyDetails = ({ admin }) => {
    const dispatch = useDispatch();

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - My Details'
    }, []);


    useEffect(() => {
        GetMyDetails()
            .then(response => {
                dispatch(LoadFirst({
                    AdminId: response.data.info.adminId,
                    Firstname: response.data.info.firstName,
                    Lastname: response.data.info.lastName,
                    Level: response.data.info.level,
                    Username: response.data.info.username,
                    Email: response.data.info.email,
                    ImgStr: response.data.info.imgByteArr,
                    ImgLink: response.data.info.imgLink,                    
                }));
            })
            .catch(error => {
            });
        return () => {
            // Reset Static Data Slots
            dispatch(ResetAll());
        }
    }, []);


    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <PageTitle title={"My Details"} />
                <div className="field mb-0">
                    <div className="field-wrap">
                        <button className="button button-brand" data-toggle="modal" data-target="#adminUpdateDetails">
                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
                            Update Info!
                        </button>
                    </div>
                </div>
            </div>
            <div className="block mydetails-block">
                <div className="text-center">
                    <div className="avatar-small mb-1  mb-3">                       
                        <img src={FigureOutImageSrc(admin.ImgStr, AdminDefaultImg, admin.ImgLink)} />
                    </div>
                </div>
                <div className="text-center">
                    <div className="field">
                        <div className="field-cap">ID
                        </div>
                        <div className="field-text">
                            #{admin.AdminId}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">First Name
                        </div>
                        <div className="field-text">
                            {admin.Firstname}
                        </div>
                    </div>

                    <div className="field">
                        <div className="field-cap">Last Name
                        </div>
                        <div className="field-text">
                            {admin.Lastname}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Level
                        </div>
                        <div className="field-text">
                            {admin.Level}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Username
                        </div>
                        <div className="field-text">
                            {admin.Username}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Email
                        </div>
                        <div className="field-text">
                            {admin.Email}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

const mapStateToProps = ({ staticData }) => ({
    admin: staticData.SlotOne.SlotInfo
});


export default connect(mapStateToProps)(AdminMyDetails);