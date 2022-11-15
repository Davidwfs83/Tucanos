import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import queryString from 'query-string';
import CheckBox from '../../../components/CheckBox';
import { GetAllFlights } from '../../../services/ApiServices/AnonymousApi';
import { AddEntity, SetQuery } from '../../../redux/PaginationSet/paginationset.actions';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import {
    ObjectDefaultValueCleaner,
    isEmptyObject,
    QueryStringToObject,
    ObjectToQueryString
} from '../../../services/Utility';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';







const FlightSearchEngineQueryGenerator = (props) => {
    const [AllowedAirlinesIds, SetAllowedAirlinesIds] = useState([]);
    const [AllowedOriginCountriesIds, SetAllowedOriginCountriesIds] = useState([]);
    const [AllowedDestinationCountriesIds, SetAllowedDestinationCountriesIds] = useState([]);
    const [DepartureTime, SetDepartureTime] = useState("");
    const [LandingTime, SetLandingTime] = useState("");
    const [MinPrice, SetMinPrice] = useState("");
    const [MaxPrice, SetMaxPrice] = useState("");
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

    //Check if url contains query string, if it does set the query in our states parameters
    //And fetch flights that match the query
    useEffect(() => {
        console.log(props.location.search);
        var urlQueryObject = QueryStringToObject(props.location.search);
        // Check To see if the query object is not empty
        if (!isEmptyObject(urlQueryObject)) {

            console.log(urlQueryObject);
            // Validate Correct Names and Types of Properties and set state accordingly
            for (const key in urlQueryObject) {
                if (key === "AllowedAirlinesIds" && Array.isArray(urlQueryObject[key]) &&
                    urlQueryObject[key].every(arrObj => (typeof arrObj === 'number'))) {
                    console.log(urlQueryObject[key]);
                    SetAllowedAirlinesIds(urlQueryObject[key])
                }
                else if (key === "AllowedOriginCountriesIds" && Array.isArray(urlQueryObject[key]) &&
                    urlQueryObject[key].every(arrObj => (typeof arrObj === 'number'))) {
                    SetAllowedOriginCountriesIds(urlQueryObject[key])
                }
                else if (key === "AllowedDestinationCountriesIds" && Array.isArray(urlQueryObject[key]) &&
                    urlQueryObject[key].every(arrObj => (typeof arrObj === 'number'))) {
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
                
            }
            GetAllFlights(ObjectDefaultValueCleaner(urlQueryObject))
                .then(response => props.AddFlights(response.data.info))
                .catch(error => {
                    dispatch(LoadPopUpData({
                        title: "Error Occured At Server",
                        infoText: error.message,
                        timeInSec: 5
                    }));
                    window.$('#InfoPopUp').modal('show')
                });
            props.QuerySetter(urlQueryObject);
        }
    }, []);


    const airlinesCheckboxesOnChange = key => {
        return e => {
            console.log(e.target.checked);
            console.log(key);
            console.log(AllowedAirlinesIds);
            if (e.target.checked) {
                if (!AllowedAirlinesIds.includes(key))
                    SetAllowedAirlinesIds([...AllowedAirlinesIds, key])
            }
            else
                SetAllowedAirlinesIds(AllowedAirlinesIds.filter(item => item !== key))
        }
    }
    const originCountriesCheckboxesOnChange = key => {
        return e => {
            if (e.target.checked) {
                if (!AllowedOriginCountriesIds.includes(key))
                    SetAllowedOriginCountriesIds([...AllowedOriginCountriesIds, key])
            }
            else
                SetAllowedOriginCountriesIds(AllowedOriginCountriesIds.filter(item => item !== key))
        }
    }
    const destinationCountriesCheckboxesOnChange = key => {
        return e => {
            if (e.target.checked)
                if (!AllowedDestinationCountriesIds.includes(key))
                SetAllowedDestinationCountriesIds([...AllowedDestinationCountriesIds, key])
            else
                SetAllowedDestinationCountriesIds(AllowedDestinationCountriesIds.filter(item => item !== key))
        }
    }
    const ButtonClick = () => {
        var queryObj = ObjectDefaultValueCleaner({
            AllowedAirlinesIds,
            AllowedOriginCountriesIds,
            AllowedDestinationCountriesIds,
            DepartureTime,
            LandingTime,
            MinPrice,
            MaxPrice
        });
        GetAllFlights(queryObj)
            .then(response => props.AddFlights(response.data.info))
            .catch(error => {
                dispatch(LoadPopUpData({
                    title: "Error Occured At Server",
                    infoText: error.message,
                    timeInSec: 5
                }));
                window.$('#InfoPopUp').modal('show')
            });
        console.log(queryObj);
        console.log(AllowedAirlinesIds);
        props.QuerySetter(queryObj);
        props.history.push({
            pathname: `${AnonymousNavigation.FlightSearch.Url}`,
            search: "?" + ObjectToQueryString(queryObj)
        });

    }

    return (
        <div className="block mb-4">
            <div className="row">
                <div className="col-6">
                    <div className="field mb-3">
                        <div className="field-cap">Airline name</div>
                        <div className="d-block">
                            <div className="dropdown-toggle button button-border mb-1 w-100 d-block" data-toggle="dropdown">
                                Choose Airlines
                            </div>
                            <div className="dropdown-menu">

                                {props.airlines.map(airline =>
                                    <CheckBox
                                        key={airline.airlineId}
                                        name={airline.airlineName}
                                        value={AllowedAirlinesIds.includes(airline.airlineId)}
                                        onChange={airlinesCheckboxesOnChange(airline.airlineId)} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
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

                <div className="col-3">
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
                                        onChange={originCountriesCheckboxesOnChange(country.id)}
                                        imgLink={country.imgLink}
                                    />)}
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
                                        onChange={destinationCountriesCheckboxesOnChange(country.id)}
                                        imgLink={country.imgLink}
                                    />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Min Price
                        </div>
                        <div className="field-wrap">
                            <input type="text" className="input" value={MinPrice} onChange=
                                {e => {
                                
                                isNaN(parseInt(e.target.value)) ? SetMinPrice("") : SetMinPrice(parseInt(e.target.value));
                                }} />
                             
                        </div>
                    </div>
                </div>

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Max Price
                        </div>
                        <div className="field-wrap">
                            <input type="text" className="input" value={MaxPrice} onChange=
                                {e => isNaN(parseInt(e.target.value)) ? SetMaxPrice("") : SetMaxPrice(parseInt(e.target.value))} />
                            
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
    airlines: paginationSet.Entities.Airlines,
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    AddFlights: flights => dispatch(AddEntity(flights, "Flights")),
    QuerySetter: query => dispatch(SetQuery(query))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlightSearchEngineQueryGenerator));





//<div className="date">
//    <input type="text" className="input" value={this.state.DepartureTime} onChange={e => this.setState({ DepartureTime: e.target.value })} />
//    <div className="input-group-addon">
//    </div>
//</div>