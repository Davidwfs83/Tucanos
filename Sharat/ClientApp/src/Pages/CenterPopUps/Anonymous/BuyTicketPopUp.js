import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import { BuyTicket } from '../../../services/ApiServices/CustomerApi';
import Logo from '../../../images/logo.png';

import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../services/Utility';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';


let BuyTicketPopUp = ({ flight, responseBox }) => {



    const [CreditCard, SetCreditCard] = useState("");
    const [ExpDate, SetExpDate] = useState("");
    const [Ccv, SetCcv] = useState("");
    const dispatch = useDispatch();

    const buttonClick = () => {
        BuyTicket({
            FlightId: flight.SlotInfo.id,
            TicketPrice: flight.SlotInfo.price,
            CreditCard
        }).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }
        ).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        });
    }

    // Clean Up Pop Up Data
    useEffect(() => {
        window.$('#buyTicketPopUp').on('hidden.bs.modal', () => {
            SetCreditCard("");
            SetCcv("");
            SetExpDate("");
            dispatch(ResetPopUpData());
        });
    }, []);
    

    return (
        <div>
            <h3 className="mb-4 text-center">Flight #{flight.SlotInfo.id}</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">
                <img alt="" src={Logo} />
            </div>         
            <div className="row row-fix btn-sec-block" >
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Origin Country
                        </div>
                        <div>
                            {flight.SlotInfo.originCountry}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Destination Country
                        </div>
                        <div>
                            {flight.SlotInfo.destinationCountry}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Departure Time
                        </div>
                        <div>
                            {flight.SlotInfo.departureTime}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Landing Time
                        </div>
                        <div>
                            {flight.SlotInfo.landingTime}
                        </div>
                    </div>

                </div>
            </div>

            <div className="row row-fix btn-sec-block" >

                <div className="col-md-12 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">Card Number
                        </div>
                        <div className="field-wrap">
                            <input type="text" value={CreditCard} className="input" onChange={e => SetCreditCard(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">Exp. Date
                        </div>
                        <div className="field-wrap">
                            <input type="text" className="input"
                                value={ExpDate} className="input" onChange={e => SetExpDate(e.target.value)}                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">CCV
                        </div>
                        <div className="field-wrap">
                            <input type="text" className="input"
                                value={Ccv} className="input" onChange={e => SetCcv(e.target.value)}                            />
                        </div>
                    </div>
                </div>

            </div>
            <div className="control text-center" >
                <a className="button btn-update" style={{ width: "200px", height: "60px", fontSize: "22px" }} onClick={buttonClick}>Pay {flight.SlotInfo.price}$ !</a>
                </div>
        </div>
    )
}

const mapStateToProps = ({ staticData, centerPopUp }) => ({
    responseBox: centerPopUp.Response,
    flight: staticData.SlotOne
});


BuyTicketPopUp = connect(mapStateToProps)(BuyTicketPopUp);
export default CenterPopUpSkeleton(BuyTicketPopUp, "buyTicketPopUp");

