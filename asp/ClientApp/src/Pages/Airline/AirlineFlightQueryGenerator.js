import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import queryString from 'query-string';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ObjectDefaultValueCleaner, isEmptyObject } from '../../services/Utility';
import { GetAllMyFlights } from '../../services/ApiServices/AirlineApi';
import { AddEntity, SetQuery } from '../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData } from '../../redux/CenterPopUp/ceneterpopup.actions';
import CheckBox from '../../components/CheckBox';
import { DashboardNavigation, AnonymousNavigation } from '../../services/NavigationConstants';


const AirlineFlightQueryGenerator = (props) => {
    const [DepartureTime, SetDepartureTime] = useState();
    const [LandingTime, SetLandingTime] = useState();
    const [AllowedOriginCountriesIds, SetAllowedOriginCountriesIds] = useState([]);
    const [AllowedDestinationCountriesIds, SetAllowedDestinationCountriesIds] = useState([]);
    const [MinPrice, SetMinPrice] = useState();
    const [MaxPrice, SetMaxPrice] = useState();
    const dispatch = useDispatch();

    // Intialize datepicker bootstrap
    useEffect(() => {
        window.$('#datepicker1').datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            window.$('#datepicker1input').change();
        });
        window.$('#datepicker1input').change(e => {
            SetDepartureTime(e.target.value);
        });
        window.$('#datepicker2').datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            window.$('#datepicker2input').change();
        });
        window.$('#datepicker2input').change(e => {
            SetLandingTime(e.target.value);
        });
    }, []);

    // Check if url contains query string, if it does set the query in our states parameters
    // And fetch flights that match the query
    useEffect(() => {
        var urlQueryObject = queryString.parse(props.location.search);
        // Check To see if the query object is not empty
        if (!isEmptyObject(urlQueryObject)) {
            // Validate Correct Names and Types of Properties and set state accordingly
            for (const key in urlQueryObject) {
                
                if (key === "AllowedOriginCountriesIds" && Array.isArray(urlQueryObject[key]) &&
                    typeof urlQueryObject[key].every(arrObj => (typeof urlQueryObject[key] === 'number'))) {
                    SetAllowedOriginCountriesIds(urlQueryObject[key])
                }
                else if (key === "AllowedDestinationCountriesIds" && Array.isArray(urlQueryObject[key]) &&
                    typeof urlQueryObject[key].every(arrObj => (typeof urlQueryObject[key] === 'number'))) {
                    SetAllowedDestinationCountriesIds(urlQueryObject[key])
                }
                else if (key === "DepartureTime" && Date.parse(urlQueryObject[key])) {
                    SetDepartureTime(urlQueryObject[key])
                }
                else if (key === "LandingTime" && Date.parse(urlQueryObject[key])) {
                    SetLandingTime(urlQueryObject[key])
                }
                else if (key === "MinPrice" && ((typeof parseInt(urlQueryObject[key])) === 'number')) {

                    SetMinPrice(parseInt(urlQueryObject[key]))
                }
                else if (key === "MaxPrice" && ((typeof parseInt(urlQueryObject[key])) === 'number')) {
                    SetMaxPrice(parseInt(urlQueryObject[key]))
                }
                else
                    props.history.push(AnonymousNavigation.ErrorPage.Url);
            }
            
        }
    }, []);



    const originCountriesCheckboxesOnChange = key => {
        return e => {
            if (e.target.value)
                SetAllowedOriginCountriesIds([...AllowedOriginCountriesIds, key])
            else
                SetAllowedOriginCountriesIds([...AllowedOriginCountriesIds.filter(item => item !== key)])
        }
    }
    const destinationCountriesCheckboxesOnChange = key => {
        return e => {
            if (e.target.value)
                SetAllowedDestinationCountriesIds([...AllowedDestinationCountriesIds, key])
            else
                SetAllowedDestinationCountriesIds([...AllowedDestinationCountriesIds.filter(item => item !== key)])
        }
    }

    const ButtonClick = () => {
        var queryObj = ObjectDefaultValueCleaner({
            AllowedOriginCountriesIds,
            AllowedDestinationCountriesIds,
            DepartureTime,
            LandingTime,
            MinPrice,
            MaxPrice
        });
        GetAllMyFlights(queryObj)
            .then(response => props.AddFlights(response.data.info))
            .catch(error => {
                dispatch(LoadPopUpData({
                    title: "Error Occured At Server",
                    infoText: error.message
                }));
                window.$('#InfoPopUp').modal('show')
            });
        props.history.push({
            pathname: `${DashboardNavigation.Airline.MyFlights.Url}`,
            search: "?" + queryString.stringify(queryObj)
        });

    }
    return (
        <div className="block mb-4">
            <div className="row">
                <div className="col-6">
                    <div className="field mb-0">
                        <div className="field-cap">Departure date
                        </div>
                        <div className="input-group date" id="datepicker1">
                            <input type="text" id="datepicker1input" />
                            <span className="input-group-append" >
                                <span className="input-group-text bg-white" >
                                    <i className="fa fa-calendar"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="field mb-0">
                        <div className="field-cap">Landing date
                        </div>
                        <div className="input-group date" id="datepicker2">
                            <input type="text" id="datepicker2input" />
                            <span className="input-group-append" >
                                <span className="input-group-text bg-white" >
                                    <i className="fa fa-calendar"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="field mb-0">
                        <div className="field-cap">Origin country
                        </div>
                        <div className="d-block">
                            <div className="dropdown-toggle button button-border mb-1 w-100 d-block" data-toggle="dropdown">
                                Country name
                            </div>
                            <div className="dropdown-menu">
                                {props.countries.map(country =>
                                    <CheckBox
                                        key={country.id}
                                        name={country.name}
                                        value={AllowedOriginCountriesIds.includes(country.id)}
                                        onChange={originCountriesCheckboxesOnChange(country.id)} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="field mb-0">
                        <div className="field-cap">Landing country
                        </div>
                        <div className="d-block">
                            <div className="dropdown-toggle button button-border mb-1 w-100 d-block" data-toggle="dropdown">
                                Country name
                            </div>
                            <div className="dropdown-menu">
                                {props.countries.map(country =>
                                    <CheckBox
                                        key={country.id}
                                        name={country.name}
                                        value={AllowedDestinationCountriesIds.includes(country.id)}
                                        onChange={destinationCountriesCheckboxesOnChange(country.id)} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Min Price
                        </div>
                        <div className="field-wrap">
                            <input type="number" className="input"  onChange={e => SetMinPrice(parseInt(e.target.value))} />
                        </div>
                    </div>
                </div>

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Max Price
                        </div>
                        <div className="field-wrap">
                            <input type="number" className="input"  onChange={e => SetMaxPrice(parseInt(e.target.value))} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field-wrap">
                        <div className="field mb-0">
                            <div className="field-cap"> &nbsp;
                            </div>
                            <div className="field-wrap">
                                <button className="button button-brand w-100" onClick={ButtonClick}>
                                    <i className="fa fa-solid fa-search mr-2"></i>
                                    Search</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    countries: paginationSet.Entities.Countries,
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    AddFlights: flights => dispatch(AddEntity(flights, "Flights")),
    QuerySetter: query => dispatch(SetQuery(query))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AirlineFlightQueryGenerator));