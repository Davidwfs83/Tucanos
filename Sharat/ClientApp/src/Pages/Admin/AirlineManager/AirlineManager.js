import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import PageTitle from '../../../components/PageTitle';
import AirlineManagerQueryGen from './AirlineManagerQueryGen';
import AirlineEntity from '../../../components/EntityComponent/AirlineEntity';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';
import { LoadPopUpData, ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { SetDisplayingEntity, ResetPaginationSet, AddEntity } from '../../../redux/PaginationSet/paginationset.actions';
import { GetAllCountries } from '../../../services/ApiServices/AnonymousApi';
import PaginationSetNoResult from '../../../components/PaginationSetNoResult';
import { isEmptyArr, isEmptyObject } from '../../../services/Utility';

const AirlineManager = (props) => {


    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Airline Manager'
    }, []);

    // Intialize Pagination Set and Get staitc data
    useEffect(() => {
        props.SetAirlinesAsDisplayingEntitiy();
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


    // Reset Center Pop Up section in redux store when bootstrap modal go backs into hiding
    useEffect(() => {
        window.$('#admin2AirlineManagerAdd').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
        window.$('#admin2AirlineManUpdateAirline').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
    }, []);
    const renderAddButtonDecider = () => {
        return props.level >= 2 ?
            (<div className="field mb-0">
                <div className="field-wrap">
                    <button className="button button-brand" data-toggle="modal" data-target="#admin2AirlineManagerAdd" >
                        <i className="fa fa-solid fa-plus-circle mr-2"></i>
                        Add Airline</button>
                </div>
            </div>
            ) :
            (
                <div className="field mb-0">
                </div>
            )
    }
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Airline Manager" />
                </div>
                <div>
                    {renderAddButtonDecider()}
                </div>
            </div>
            <AirlineManagerQueryGen />
            <div className="block">
                {
                    (isEmptyArr(props.airlines) && (!isEmptyObject(props.query))) ?
                        (<PaginationSetNoResult />)  :
                        (props.airlines.map(airline => (
                        <div key={airline.airlineId} onClick={() => {
                            props.LoadUpdatePopUpData(airline);
                            window.$('#admin2AirlineManUpdateAirline').modal('show');
                        }} >
                            <AirlineEntity Airline={airline} />
                        </div>
                    )
                    ))
                }
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    airlines: paginationSet.CurrentEntities.EntityData,
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetAirlinesAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Airlines")),
    AddCountries: countries => dispatch(AddEntity(countries, "Countries")),
    LoadUpdatePopUpData: airline => dispatch(LoadPopUpData(airline,"Airline")),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default connect(mapStateToProps, mapDispatchToProps)(AirlineManager);


