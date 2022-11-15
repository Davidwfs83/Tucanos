import React, { useEffect , useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { DateTimeToDateAndTimeParser } from '../../../services/Utility';
import $ from 'jquery';
import { RemoveTicket } from '../../../services/ApiServices/CustomerApi';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { RemoveSingleEntity } from '../../../redux/PaginationSet/paginationset.actions';
import RedTicket from '../../../images/ticket-red.png';
import YellowTicket from '../../../images/ticket-yellow.png';
import GreenTicket from '../../../images/ticket-green.png';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../services/Utility';

let CustomerTicketPopUp = ({ ticket, responseBox}) => {
    const [DepartureDate, SetDepartureDate] = useState({});
    const [LandingDate, SetLandingDate] = useState({});
    const dispatch = useDispatch();

    // Extract Date To Proper Format
    useEffect(() => {
        SetDepartureDate(DateTimeToDateAndTimeParser(ticket.departureTime));
        SetLandingDate(DateTimeToDateAndTimeParser(ticket.landingTime));
       
    }, [ticket.departureTime, ticket.landingTime]);

    // Clean Up Pop Up Data
    useEffect(() => {
        window.$('#customerTicketDetails').on('hidden.bs.modal', () => {
            SetDepartureDate({});
            SetLandingDate({});
            dispatch(ResetPopUpData());
        });
    }, []);
    
    const determineTicketImage = () => {
        var now = Date.now();
        var departure = Date.parse(ticket.departureTime);
        var landing = Date.parse(ticket.landingTime);
        if (departure > now)
            return GreenTicket;
        if (departure < now < landing)
            return YellowTicket
        else
            return RedTicket
    }

    const buttonOnClick = () => {
        RemoveTicket(ticket.ticketId).then(response => {
            // Extract Msg for response box
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            // Update Redux Pagination Slice
            dispatch(RemoveSingleEntity("Tickets", ticket.ticketId, "ticketId"))
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    return (
        <div>            
            <h3 className="mb-4 text-center">#{ticket.ticketId}</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">
                <img alt="" src={determineTicketImage()} />
            </div>
            

            <div className="row row-fix btn-sec-block">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            FlightId
                        </div>
                        <div className="field-text text-left">
                            #{ticket.flightId}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Airline
                        </div>
                        <div className="field-text text-left">
                            {ticket.airlineName}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Departure Time
                        </div>
                        <div className="field-text text-left">
                            {DepartureDate.Date}
                            <br />
                            {DepartureDate.Time}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Landing Time
                        </div>
                        <div className="field-text text-left">
                            {LandingDate.Date}
                            <br />
                            {LandingDate.Time}
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Origin Country
                        </div>
                        <div className="field-text text-left">
                            {ticket.originCountryName}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Destination Country
                        </div>
                        <div className="field-text text-left">
                            {ticket.destinationCountryName}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Price 
                        </div>
                        <div className="field-text text-left">
                            {ticket.price}$
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Points Consumed
                        </div>
                        <div className="field-text text-left">
                            {`${ticket.price - ticket.cost}`}
                        </div>
                    </div>
                </div>

                
            </div>
            {
                Date.parse(ticket.departureTime) > Date.now() ?
                    (<div className="control text-center">
                        <a className="button btn-remove" onClick={buttonOnClick}>Remove</a>
                    </div>) : null
            }
            
        </div>
        )
}


const mapStateToProps = ({ centerPopUp }) => ({
    ticket: centerPopUp.PopUpInfo,
    responseBox: centerPopUp.Response
});
CustomerTicketPopUp = connect(mapStateToProps)(CustomerTicketPopUp);
export default CenterPopUpSkeleton(CustomerTicketPopUp, "customerTicketDetails");