import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { connect, useDispatch } from 'react-redux';
import { ObjectDefaultValueCleaner, isEmptyObject } from '../../../services/Utility';
import { QueryAllCountries } from '../../../services/ApiServices/AdminApi';
import { AddEntity } from '../../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { DashboardNavigation, AnonymousNavigation } from '../../../services/NavigationConstants';

const CountryManagerQueryGen = (props) => {
    const [Name, SetName] = useState('');
    const dispatch = useDispatch();

    // Check if url contains query string, if it does set the query in our states parameters
    // And fetch flights that match the query
    useEffect(() => {
        var urlQueryObject = queryString.parse(props.location.search);
        // Check To see if the query object is not empty
        if (!isEmptyObject(urlQueryObject)) {
            // Validate Correct Names and Types of Properties and set state accordingly
            for (const key in urlQueryObject) {

                if (key === "Name" && ((typeof urlQueryObject[key]) === 'string')
                    && urlQueryObject[key] !== "") {
                    SetName(urlQueryObject[key])
                }                
                else
                    props.history.push(AnonymousNavigation.ErrorPage.Url);
            }
            QueryAllCountries(ObjectDefaultValueCleaner(urlQueryObject))
                .then(response => {
                    props.AddCountries(response.data.info);
                })
                .catch(error => {
                    console.log(error);
                    dispatch(LoadPopUpData({
                        title: "Error Occured At Server",
                        infoText: error.message
                    }));
                    window.$('#InfoPopUp').modal('show')
                });
        }
    }, []);



    const buttonOnClick = () => {
        var queryObj = ObjectDefaultValueCleaner(
            {
                Name
            });
        QueryAllCountries(ObjectDefaultValueCleaner(queryObj))
            .then(response => {
                props.AddCountries(response.data.info);
            })
            .catch(error => {
                dispatch(LoadPopUpData({
                    title: "Error Occured At Server",
                    infoText: error.message
                }));
                window.$('#InfoPopUp').modal('show')
            });
        props.history.push({
            pathname: `${DashboardNavigation.AdminLevelThree.CountryManager.Url}`,
            search: "?" + queryString.stringify(queryObj)
        });
    };


    return (
        <div className="block mb-4">
            <div className="row">

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap"> Name
                        </div>
                        <div className="field-wrap">
                            <input type="text" value={Name} className="input"
                                onChange={e => SetName(e.target.value)} />
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



const mapDispatchToProps = dispatch => ({
    AddCountries: countries => dispatch(AddEntity(countries, "Countries"))
});

export default withRouter(connect(null, mapDispatchToProps)(CountryManagerQueryGen));
