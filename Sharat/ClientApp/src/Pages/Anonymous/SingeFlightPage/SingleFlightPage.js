import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GetFlight, GetAirline, GetReviewsByAirline } from '../../../services/ApiServices/AnonymousApi';
import PageTitle from '../../../components/PageTitle';
import FlightEntity from '../../../components/EntityComponent/FlightEntity';
import { ResetAll, LoadFirst, LoadSecond } from '../../../redux/PageStaticData/pagestaticdata.action';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import {
    AddEntity, SetDisplayingEntity, ResetPaginationSet
} from '../../../redux/PaginationSet/paginationset.actions';
import { GetTicketsByFlight } from '../../../services/ApiServices/AirlineApi';
import AirlineSelfFlightPage from './AirlineSelfFlightPage';
import AnonFlightPage from './AnonFlightPage';
import { isEmptyObject } from '../../../services/Utility';
import FlightMap from './FlightMap/FlightMap';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';





// Flight is expected to be in static slot 1
// Airline (if its not self airline flight page) should be in slot 2
// Tickets (if it is a self airline flight page) should be in the pagination set as the displayin entity
const SingeFlightPage = (props) => {
 

    // Load Flight Info Either from redux or from server, Depending from where the component
    // was loaded
    useEffect(() => {
        // Load from Server according to url param
        if (isEmptyObject(props.flight.SlotInfo) || props.flight.SlotType !== "Flight") {

            GetFlight(props.match.params.flightId)
                .then(response => {
                    props.LoadFlightToSlot(response.data.info);
                    // Case when the user is an Airline and the flight is theirs - Were Displaying Tickets in The bottom of the page
                    if (props.user.userType === 'Airline' && response.data.info.airlineId === props.user.userInfo.Id) {
                        props.SetTicketsDisplayType();
                        GetTicketsByFlight(props.match.params.flightId)
                            .then(responseTwo => {
                                props.AddTickets(responseTwo.data.info)
                            })
                            .catch(error => props.history.push(AnonymousNavigation.ErrorPage))
                    }
                    // Every other case
                    else {

                        props.SetReviewsDisplayType();
                        GetAirline(response.data.info.airlineId)
                            .then(response => props.LoadAirlineToSlot(response.data.info))
                            .catch(error => props.history.push(AnonymousNavigation.ErrorPage))

                        // Reviews are not implmented yet so we will use lorem ipsum
                        //GetReviews(...)
                    }

                })

                .catch(error => console.log(error))
        }
        // Load From Redux
        else {
            // Case when the user is an Airline and the flight is theirs - Were Displaying Tickets in The bottom of the page
            if (props.user.userType === 'Airline' && props.flight.SlotInfo.airlineId === props.user.userInfo.Id) {
                props.SetTicketsDisplayType();
                GetTicketsByFlight(props.match.params.flightId)
                    .then(response => {
                        props.AddTickets(response.data.info)
                    })
                    .catch(error => props.history.push(AnonymousNavigation.ErrorPage))
            }
            // Every other case
            else {
                props.SetReviewsDisplayType();
                GetAirline(props.flight.SlotInfo.airlineId)
                    .then(response => {
                        props.LoadAirlineToSlot(response.data.info);
                        return response.data.info.airlineId;
                    }).then(airlineId => {
                        
                        GetReviewsByAirline(airlineId).then(response2 => props.AddReviews(response2.data.info))
                    })
                    .catch(error => props.history.push(AnonymousNavigation.ErrorPage))

            }
        }
        return () => {
            props.ResetAllSlots();
            props.ResetPagination();
        }
    }, []);

    useEffect(() => {
        document.title = `Tucanos - Flight ${props.flight.SlotInfo.id}`
    }, [])


    


    const renderBuyTicketButton = () => {
        return (props.user.userType === 'Customer' ?
            (
                <div className="text-center pt-4 pb-0">
                    <button className="button btn-create button-large" data-toggle="modal" data-target="#buyTicketPopUp">
                        Buy Ticket!
                    </button>
                </div>
            ) :
            (
                <div className="text-center pt-4 pb-0">
                    <div className=" button-brand button-large"></div>
                </div>)
        )
    }

    return (
        <div className="max1050">

            <div className="d-flex justify-content-between mb-2">
                <PageTitle title={`Flight #${props.flight.SlotInfo.id}`} />
                <div>
                    <div className="field mb-0">
                    </div>
                </div>
            </div>
            <div className="block">
                {
                    (isEmptyObject(props.flight.SlotInfo) || props.flight.SlotType !== "Flight") ?
                        null :
                        (< FlightEntity key={props.flight.SlotInfo.id} {...props.flight.SlotInfo} />)
                }
                <FlightMap
                    origin={
                        {
                            latitude: props.flight.SlotInfo.originLatitude,
                            longitude: props.flight.SlotInfo.originLongitude
                        }
                    }
                    destination={
                        {
                            latitude: props.flight.SlotInfo.destinationLatitude,
                            longitude: props.flight.SlotInfo.destinationLongitude
                        }
                    }
                />
                {renderBuyTicketButton()}
            </div>
            {
                props.user.userType === 'Airline' && props.flight.SlotInfo.airlineId === props.user.userInfo.Id ?
                    (<AirlineSelfFlightPage />) :
                    (<AnonFlightPage />)
            }
        </div>
    )
}


const mapStateToProps = ({ auth, staticData }) => ({
    user: auth.currentUser,
    flight: staticData.SlotOne
});

const mapDispatchToProps = dispatch => ({
    ResetAllSlots: () => dispatch(ResetAll()),
    LoadFlightToSlot: flight => dispatch(LoadFirst(flight, "Flight")),
    LoadAirlineToSlot: airline => dispatch(LoadSecond(airline, "Airline")),
    SetReviewsDisplayType: () => dispatch(SetDisplayingEntity("Reviews", 5)),
    SetTicketsDisplayType: () => dispatch(SetDisplayingEntity("Tickets", 5)),
    AddTickets: tickets => dispatch(AddEntity(tickets, "Tickets")),
    AddReviews: reviews => dispatch(AddEntity(reviews, "Reviews")),
    ResetPagination: () => dispatch(ResetPaginationSet()),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingeFlightPage));




