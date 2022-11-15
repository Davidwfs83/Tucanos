import React, { useEffect , useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { DateTimeToDateAndTimeParser } from '../../../services/Utility';
import $ from 'jquery';
import { RemoveFlight } from '../../../services/ApiServices/AirlineApi';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { RemoveSingleEntity } from '../../../redux/PaginationSet/paginationset.actions';
import RedFlight from '../../../images/flight-red.png';
import YellowFlight from '../../../images/flight-yellow.png';
import GreenFlight from '../../../images/flight-green.png';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';
import {
    ExtractStatusAndMsgForSuccessPopup,
    ExtractStatusAndMsgForErrorPopup
} from '../../../services/Utility';

let AirlineDisplayFlightPopUp = ({ flight, responseBox}) => {
    const [DepartureDate, SetDepartureDate] = useState({});
    const [LandingDate, SetLandingDate] = useState({});
    const dispatch = useDispatch();

    // Extract Date To Proper Format
    useEffect(() => {
        SetDepartureDate(DateTimeToDateAndTimeParser(flight.departureTime));
        SetLandingDate(DateTimeToDateAndTimeParser(flight.landingTime));
       
    }, [flight.departureTime, flight.landingTime]);

    // Clean Up Pop Up Data
    useEffect(() => {
        window.$('#airlineDisplayFlightPopUp').on('hidden.bs.modal', () => {
            SetDepartureDate({});
            SetLandingDate({});
            dispatch(ResetPopUpData());
        });
    }, []);
    
    const determineFlightImage = () => {
        var now = Date.now();
        var departure = Date.parse(flight.departureTime);
        var landing = Date.parse(flight.landingTime);
        if (departure > now)
            return GreenFlight;
        if (departure < now < landing)
            return YellowFlight
        else
            return RedFlight
    }

    const buttonOnClick = () => {
        RemoveFlight(flight.id).then(response => {
            // Extract Msg for response box
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
            // Update Redux Pagination Slice
            dispatch(RemoveSingleEntity("Flights", flight.id, "id"))
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    return (
        <div>            
            <h3 className="mb-4 text-center">Flight #{flight.id}</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            <div className="avatar-small mb-1">
                <img alt="" src={determineFlightImage()} />
            </div>
            

            <div className="row row-fix btn-sec-block">
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
                            {flight.originCountry}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Departure Country
                        </div>
                        <div className="field-text text-left">
                            {flight.destinationCountry}
                        </div>
                    </div>
                </div>

                               
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Price 
                        </div>
                        <div className="field-text text-left">
                            {flight.price}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Remaining Tickets
                        </div>
                        <div className="field-text text-left">
                            {flight.remainingTickets}
                        </div>
                    </div>
                </div>

                
            </div>
            {
                Date.parse(flight.departureTime) > Date.now() ?
                    (<div className="control text-center">
                        <a className="button btn-remove" onClick={buttonOnClick}>Remove</a>
                    </div>) : null
            }
            
        </div>
        )
}


const mapStateToProps = ({ centerPopUp }) => ({
    flight: centerPopUp.PopUpInfo,
    responseBox: centerPopUp.Response
});
AirlineDisplayFlightPopUp = connect(mapStateToProps)(AirlineDisplayFlightPopUp);

export default CenterPopUpSkeleton(AirlineDisplayFlightPopUp, "airlineDisplayFlightPopUp");