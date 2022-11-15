import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import {
    GetCustomer
} from '../../services/ApiServices/CustomerApi';
import CustomerDefaultImg from '../../images/defaultCustomer.png';
import PageTitle from '../../components/PageTitle';
import { LoadFirst, ResetAll } from '../../redux/PageStaticData/pagestaticdata.action';
import { FigureOutImageSrc } from '../../services/Utility';


const CustomerMyDetails = ({customer }) => {
   
    const dispatch = useDispatch();

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - My Details'
    }, []);


    useEffect(() => {
        GetCustomer()
            .then(response => {
                dispatch(LoadFirst({
                    CustomerId: response.data.info.id,
                    FirstName: response.data.info.firstName,
                    LastName: response.data.info.lastName,
                    CreditCard: response.data.info.creditCard,
                    PhoneNu: response.data.info.phoneNu,
                    Address: response.data.info.address,
                    Gender: response.data.info.gender,
                    Points: response.data.info.points,
                    UserName: response.data.info.userName,
                    Email: response.data.info.email,
                    ImgLink: response.data.info.imgLink,
                    ImgStr: response.data.info.imgByteArr
                }));

            });
        return () => {
            dispatch(ResetAll());
        }
    },[])
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">

                <PageTitle title={"My Details"} />

                <div className="field mb-0">
                    <div className="field-wrap">
                        <button className="button button-brand" data-toggle="modal" data-target="#customerUpdateDetails">
                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
                            Update Info!</button>
                    </div>
                </div>
            </div>
            <div className="block mydetails-block">
                <div className="text-center">
                    <div className="avatar-small mb-1 mb-3">
                        <img alt="" src={FigureOutImageSrc(customer.ImgStr, CustomerDefaultImg, customer.ImgLink)} />
                    </div>
                </div>
                <div className="text-center">
                    <div className="field">
                        <div className="field-cap">ID
                        </div>
                        <div className="field-text">
                            #{customer.CustomerId}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">First Name
                        </div>
                        <div className="field-text">
                            {customer.FirstName}
                        </div>
                    </div>

                    <div className="field">
                        <div className="field-cap">Last name
                        </div>
                        <div className="field-text">
                            {customer.LastName}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Address
                        </div>
                        <div className="field-text">
                            {customer.Address}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Credit card
                        </div>
                        <div className="field-text">
                            {customer.CreditCard}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Phone number
                        </div>
                        <div className="field-text">
                            {customer.PhoneNu}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Gender
                        </div>
                        <div className="field-text">
                            {customer.Gender}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Points
                        </div>
                        <div className="field-text">
                            {customer.Points}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Username
                        </div>
                        <div className="field-text">
                            {customer.UserName}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Email
                        </div>
                        <div className="field-text">
                            {customer.Email}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


const mapStateToProps = ({ staticData }) => ({
    customer: staticData.SlotOne.SlotInfo
});



export default connect(mapStateToProps)(CustomerMyDetails);