import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    ObjectDefaultValueCleaner,
    isEmptyObject,
    QueryStringToObject,
    ObjectToQueryString

} from '../../../services/Utility';
import { AddEntity, SetQuery } from '../../../redux/PaginationSet/paginationset.actions';
import { QueryAllAirlines } from '../../../services/ApiServices/AdminApi';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { DashboardNavigation, AnonymousNavigation } from '../../../services/NavigationConstants';
import CheckBox from '../../../components/CheckBox';

const AirlineManagerQueryGen = (props) => {
    const [Name, SetName] = useState('');
    const [AllowedCountriesId, SetAllowedCountriesId] = useState([]);
    const dispatch = useDispatch();

    // Check if url contains query string, if it does set the query in our states parameters
    // And fetch flights that match the query
    useEffect(() => {
      // var urlQueryObject = queryString.parse(props.location.search);
        var urlQueryObject = QueryStringToObject(props.location.search);
         
        // Check To see if the query object is not empty        
        if (!isEmptyObject(urlQueryObject)) {
            // Validate Correct Names and Types of Properties and set state accordingly
            for (const key in urlQueryObject) {

                if (key === "Name" && ((typeof urlQueryObject[key]) === 'string')
                    && urlQueryObject[key] !== "") {
                    SetName(urlQueryObject[key])
                }
                
                if (key === "AllowedCountriesId" && Array.isArray(urlQueryObject[key]) &&
                     urlQueryObject[key].every(arrObj => (typeof urlQueryObject[key] === 'number'))) {
                   
                    SetAllowedCountriesId(urlQueryObject[key])
                }
            }
            QueryAllAirlines(ObjectDefaultValueCleaner(urlQueryObject))
                .then(response => {
                    props.AddAirlines(response.data.info);
                })
                .catch(error => {
                    dispatch(LoadPopUpData({
                        title: "Error Occured At Server",
                        infoText: error.message
                    }));
                    window.$('#InfoPopUp').modal('show')
                });
            props.QuerySetter(urlQueryObject);
        }
    }, []);

    const AllowedCountriesCheckboxesOnChange = key => {
        return e => {
            
            if (e.target.checked) {
                if (!AllowedCountriesId.includes(key))
                    SetAllowedCountriesId([...AllowedCountriesId, key])
            }
                else
                    SetAllowedCountriesId(AllowedCountriesId.filter(item => item !== key))
        }
    }

    const buttonOnClick = () => {
        var queryObj = ObjectDefaultValueCleaner(
            {
                Name,
                AllowedCountriesId
            });
        QueryAllAirlines(ObjectDefaultValueCleaner(queryObj))
            .then(response => {
                props.AddAirlines(response.data.info);
            })
            .catch(error => {
                dispatch(LoadPopUpData({
                    title: "Error Occured At Server",
                    infoText: error.message,
                    timeInSec: 3
                }));
                window.$('#InfoPopUp').modal('show')
            });
        props.QuerySetter(queryObj === {} ? null : queryObj);
        props.history.push({
            pathname: `${DashboardNavigation.AdminLevelOne.AirlineManager.Url}`,
            search: "?" + ObjectToQueryString(queryObj)
        });
    };


    return (
        <div className="block mb-4">
            <div className="row">

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Name
                        </div>
                        <div className="field-wrap">
                            <input type="text" value={Name} className="input" onChange={e => SetName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Allowed Countries
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
                                        value={AllowedCountriesId.includes(country.id)}
                                        onChange={AllowedCountriesCheckboxesOnChange(country.id)} />)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field-wrap">
                        <div className="field mb-0">
                            <div className="field-cap"> &nbsp;</div>
                            <div className="field-wrap">
                                <button className="button button-brand w-100" onClick={buttonOnClick}>
                                    <i className="fa fa-solid fa-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ paginationSet }) => ({
    query: paginationSet.Query,
    countries: paginationSet.Entities.Countries
});

const mapDispatchToProps = dispatch => ({
    AddAirlines: airlines => dispatch(AddEntity(airlines, "Airlines")),
    QuerySetter: query => dispatch(SetQuery(query))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AirlineManagerQueryGen));
