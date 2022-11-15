import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import FlightEntity from '../../components/EntityComponent/FlightEntity';
import AirlineFlightQueryGenerator from './AirlineFlightQueryGenerator';
import PageTitle from '../../components/PageTitle';
import PaginationSetNavigtaion from '../../components/PaginationSetNavigation';
import {  LoadPopUpData, ResetPopUpData,  } from '../../redux/CenterPopUp/ceneterpopup.actions';

import {
    GetAllCountries
} from '../../services/ApiServices/AnonymousApi';
import { ResetPaginationSet, SetDisplayingEntity, AddEntity } from '../../redux/PaginationSet/paginationset.actions';
import { AnonymousNavigation } from '../../services/NavigationConstants';

const AirlineMyFlights = (props) => {


    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - My Flights'
    }, []);

    // Intialize Pagination Set and Get staitc data
    useEffect(() => {
        props.SetFlightsAsDisplayingEntitiy();
        GetAllCountries()
            .then(response => props.AddCountries(response.data.info))
            .catch(error => {
                props.LoadErrorPopUpData(error.message);
                window.$('#InfoPopUp').modal('show');
            })
        return () => {
            props.ResetPaginationSet();
        }
    }, []);

    // Reset Pagination Set Clean Up
    useEffect(() => {
        return () => {
            props.ResetPaginationSet();
        }
    }, []);

    // Reset Pop Up Clean Up
    useEffect(() => {
        $('#airlineAddFlight').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
        $('#airlineDisplayFlightPopUp').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });      
    }, []);
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="My Flights" />
                </div>
                <div className="field mb-0">
                    <div className="field-wrap">
                        <button className="button button-brand" data-toggle="modal" data-target="#airlineAddFlight" >
                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
										Add Flight
                        </button>
                    </div>
                </div>
            </div>
            <AirlineFlightQueryGenerator />
            <div className="block">
                {props.flights.map(flight => (
                    <div  key={flight.id}
                        onClick={() => {
                            props.LoadFlight(flight);
                            window.$('#airlineDisplayFlightPopUp').modal('show');
                        }}
                    >
                        <FlightEntity key={flight.id} {...flight} />
                    </div>))}
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    flights: paginationSet.CurrentEntities.EntityType === "Flights" ? paginationSet.CurrentEntities.EntityData : []
});

const mapDispatchToProps = dispatch => ({
    AddCountries: countries => dispatch(AddEntity(countries, "Countries")),
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetFlightsAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Flights")),
    LoadFlight: flight => dispatch(LoadPopUpData(flight, "Flight")),
    LoadErrorPopUpData: errorMsg => dispatch(LoadPopUpData({ title: "Oops! Unexpected Error Occured", infoText: errorMsg })),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default connect(mapStateToProps, mapDispatchToProps)(AirlineMyFlights);