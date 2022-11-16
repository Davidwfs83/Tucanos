import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { connect, useDispatch } from 'react-redux';
import { ObjectDefaultValueCleaner, isEmptyObject } from '../../../services/Utility';
import { QueryAllAdmins } from '../../../services/ApiServices/AdminApi';
import { AddEntity } from '../../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { DashboardNavigation, AnonymousNavigation } from '../../../services/NavigationConstants';

const AdminManagerQueryGen = (props) => {
    const [FirstName, SetFirstName] = useState('');
    const [LastName, SetLastName] = useState('');
    const [Level, SetLevel] = useState("1");
    const dispatch = useDispatch();

    // Check if url contains query string, if it does set the query in our states parameters
    // And fetch flights that match the query
    useEffect(() => {
        var urlQueryObject = queryString.parse(props.location.search);
        // Check To see if the query object is not empty
        if (!isEmptyObject(urlQueryObject)) {
            // Validate Correct Names and Types of Properties and set state accordingly
            for (const key in urlQueryObject) {

                if (key === "FirstName" && ((typeof urlQueryObject[key]) === 'string')
                    && urlQueryObject[key] !== "") {
                    SetFirstName(urlQueryObject[key])
                }
                if (key === "LastName" && ((typeof urlQueryObject[key]) === 'string')
                    && urlQueryObject[key] !== "") {
                    SetLastName(urlQueryObject[key])
                }
                else if (key === "Level" && ((typeof parseInt(urlQueryObject[key])) === 'number')) {

                    SetLevel(parseInt(urlQueryObject[key]))
                }
                else
                    props.history.push(AnonymousNavigation.ErrorPage.Url);
            }
            QueryAllAdmins(ObjectDefaultValueCleaner(urlQueryObject))
                .then(response => {
                    props.AddAdmins(response.data.info);
                })
                .catch(error => {
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
                FirstName,
                LastName,
                Level
            });
        QueryAllAdmins(ObjectDefaultValueCleaner(queryObj))
            .then(response => {
                props.AddAdmins(response.data.info);
            })
            .catch(error => {
                dispatch(LoadPopUpData({
                    title: "Error Occured At Server",
                    infoText: error.message
                }));
                window.$('#InfoPopUp').modal('show')
            });
        props.history.push({
            pathname: `${DashboardNavigation.AdminLevelThree.AdminManager.Url}`,
            search: "?" + queryString.stringify(queryObj)
        });
    };


    return (
        <div className="block mb-4">
            <div className="row">

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">First Name
                        </div>
                        <div className="field-wrap">
                            <input type="text" value={FirstName} className="input"
                                onChange={e => SetFirstName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Last Name
                        </div>
                        <div className="field-wrap">
                            <input type="text" value={LastName} className="input"
                                onChange={e => SetLastName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Level
                        </div>
                        <select className="select" value={Level }
                            onChange={e => SetLevel(parseInt(e.target.value))}>
                            <option key={1} value={"1"} >1</option>
                            <option key={2} value={"2"} >2</option>
                            {
                                props.level > 3 ?
                                    (<option key={3} value={"3"} >3</option>)
                                    : null
                            }
                        </select>
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
    AddAdmins: admins => dispatch(AddEntity(admins, "Admins"))
});

export default withRouter(connect(null, mapDispatchToProps)(AdminManagerQueryGen));
