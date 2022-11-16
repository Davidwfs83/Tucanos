import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import PageTitle from '../../../components/PageTitle';
import CountryManagerQueryGen from './CountryManagerQueryGen';
import CountryEntity from '../../../components/EntityComponent/CountryEntity';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';
import { LoadPopUpData, ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { SetDisplayingEntity, ResetPaginationSet, AddEntity } from '../../../redux/PaginationSet/paginationset.actions';

const CountryManager = (props) => {

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Country Manager'
    }, []);


    // Intialize Pagination Set and Get staitc data
    useEffect(() => {
        props.SetCountriesAsDisplayingEntitiy();
        return () => {
            props.ResetPaginationSet();
        }
    }, []);



    // Reset Center Pop Up section in redux store when bootstrap modal go backs into hiding
    useEffect(() => {
        window.$('#admin3CountryManagerAdd').on('hidden.bs.modal', () => {
            console.log("shalom");
            props.ResetPopUp();
        });
        window.$('#admin3CountryManUpdateRemove').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
    }, []);
 
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <PageTitle title="Country Manager" />
                </div>
                <div className="field mb-0">
                    <div className="field-wrap">
                        <button className="button button-brand" data-toggle="modal" data-target="#admin3CountryManagerAdd" >
                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
                        Add Country</button>
                    </div>
                </div>
            </div>
            <CountryManagerQueryGen  />
            <div className="block">
                {props.countries.map(country => (
                    <div key={country.id} onClick={() => {
                        props.LoadUpdatePopUpData(country);
                        window.$('#admin3CountryManUpdateRemove').modal('show');
                    }} >
                        <CountryEntity  {...country} />
                    </div>
                )
                )}
            </div>
            <PaginationSetNavigtaion />
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    countries: paginationSet.CurrentEntities.EntityData
});

const mapDispatchToProps = dispatch => ({
    ResetPaginationSet: () => dispatch(ResetPaginationSet()),
    SetCountriesAsDisplayingEntitiy: () => dispatch(SetDisplayingEntity("Countries")),
    LoadUpdatePopUpData: country => dispatch(LoadPopUpData(country)),
    ResetPopUp: () => dispatch(ResetPopUpData())
});

export default connect(mapStateToProps, mapDispatchToProps)(CountryManager);


