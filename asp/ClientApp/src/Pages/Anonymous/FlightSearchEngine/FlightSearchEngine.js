import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle';
import {
    GetAllCountries,
    GetAllAirlines
} from '../../../services/ApiServices/AnonymousApi';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import {
    AddEntity,
    ResetPaginationSet,
    SetDisplayingEntity
} from '../../../redux/PaginationSet/paginationset.actions';
import {
    isEmptyArr,
    isEmptyObject
} from '../../../services/Utility';
import FlightSearchEngineQueryGenerator from './FlightSearchEngineQueryGenerator';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';
import FlightEntity from '../../../components/EntityComponent/FlightEntity';
import { LoadFirst } from '../../../redux/PageStaticData/pagestaticdata.action';
import PaginationSetNoResult from '../../../components/PaginationSetNoResult';


const FlightSearchEngine = (props) => {

    useEffect(() => {
        document.title = 'Tucanos - Flight Search'
    }, [])

    // Intialize Pagination Set and Get staitc data
    useEffect(() => {
        props.SetFlightsAsDisplayingEntitiy();
        GetAllCountries()
            .then(response => props.AddCountries(response.data.info))
            .catch(error => {
                props.LoadErrPageInfo();
                props.history.push(AnonymousNavigation.ErrorPage.Url)
            });
        GetAllAirlines()
            .then(response => props.AddAirlines(response.data.info))
            .catch(error => {
                props.LoadErrPageInfo();
                props.history.push(AnonymousNavigation.ErrorPage.Url)
            });

    }, []);
    useEffect(() => {
        return () => {
            props.ResetPaginationSet();
        }
    }, [])

    return (
        <div className="max1050">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Flight Search Engine" />
                </div>
                <div>
                    <div className="field mb-0">
                    </div>

                </div>
            </div>
            <FlightSearchEngineQueryGenerator />
            <div className="block">

                {
                    (isEmptyArr(props.flights.EntityData) && (!isEmptyObject(props.query))) ?
                        (<PaginationSetNoResult />) :
                        (props.flights.EntityType === "Flights" ?
                            props.flights.EntityData.map(flight => (
                                <Link to={AnonymousNavigation.SingleFlight.CalcUrl(flight.id)} key={flight.id}
                                    onClick={() => props.LoadFlightToSlot(flight)}
                                >
                                    <FlightEntity key={flight.id} {...flight} />
                                </Link>))
                            : null)
                }
                
                {/*{*/}
                {/*    props.flights.EntityType === "Flights" ?*/}
                {/*        props.flights.EntityData.map(flight => (*/}
                {/*            <Link to={AnonymousNavigation.SingleFlight.CalcUrl(flight.id)} key={flight.id}*/}
                {/*                onClick={() => props.LoadFlightToSlot(flight)}*/}
                {/*            >*/}
                {/*                <FlightEntity key={flight.id} {...flight} />*/}
                {/*            </Link>))*/}
                {/*        : null*/}
                {/*}*/}
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}


const mapStateToProps = ({ paginationSet }) => ({
    flights: paginationSet.CurrentEntities,
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    AddCountries: countries => dispatch(AddEntity(countries, "Countries")),
    AddAirlines: airlines => dispatch(AddEntity(airlines, "Airlines")),
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetFlightsAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Flights")),
    LoadFlightToSlot: flight => dispatch(LoadFirst(flight, "Flight")),
    LoadErrPageInfo: () => dispatch(LoadFirst({
        statusCode: 500,
        message: "Server Encounterd some Issues... Please Come visit us at your eariliest convinience"
    }))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlightSearchEngine));