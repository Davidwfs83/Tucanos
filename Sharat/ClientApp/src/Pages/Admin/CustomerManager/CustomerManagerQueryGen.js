import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import {
    ObjectDefaultValueCleaner,
    isEmptyObject,
    QueryStringToObject,
    ObjectToQueryString
} from '../../../services/Utility';
import { QueryAllCustomers } from '../../../services/ApiServices/AdminApi';
import { AddEntity, SetQuery } from '../../../redux/PaginationSet/paginationset.actions';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { DashboardNavigation, AnonymousNavigation } from '../../../services/NavigationConstants';





const CustomerManagerQueryGen = (props) => {
    const [FirstName, SetFirstName] = useState('');
    const [LastName, SetLastName] = useState('');
    const [Address, SetAddress] = useState('');
    const [Gender, SetGender] = useState(null);
    const dispatch = useDispatch();


    // Check if url contains query string, if it does set the query in our states parameters
    // And fetch flights that match the query
    useEffect(() => {
        console.log(props.location.search);
        var urlQueryObject = QueryStringToObject(props.location.search);
        // Check To see if the query object is not empty
        console.log(urlQueryObject);
        
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
                 if (key === "Address" && ((typeof urlQueryObject[key]) === 'string')
                    && urlQueryObject[key] !== "") {
                    SetAddress(urlQueryObject[key])
                }
                if (key === "Gender" ) {

                    if (((typeof urlQueryObject[key]) === 'boolean')) {
                        SetGender(urlQueryObject[key])
                    }
                    if (urlQueryObject[key] === null) {
                        SetGender(null);                       
                    }                    
                }                          
            }           
            props.QuerySetter(urlQueryObject);
            QueryAllCustomers(urlQueryObject)
                .then(response => {
                    props.AddCustomers(response.data.info);
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
        var queryObj = ObjectDefaultValueCleaner({ FirstName, LastName, Address, Gender });
        
      
        QueryAllCustomers(queryObj)
            .then(response => {
                props.AddCustomers(response.data.info);
            });
            
        props.QuerySetter(queryObj === {} ? null : queryObj);
        if (queryObj.Gender === null)
            queryObj.Gender = 'null';
        props.history.push({
            pathname: `${DashboardNavigation.AdminLevelOne.CustomerManager.Url}`,
            search: "?" + ObjectToQueryString(queryObj)
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
                            <input type="text" placeholder="" value={FirstName} className="input" onChange={e => SetFirstName(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Last Name
                        </div>
                        <div className="field-wrap">
                            <input type="text" placeholder="" value={LastName} className="input" onChange={e => SetLastName(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Address
                        </div>
                        <div className="field-wrap">
                            <input type="text" placeholder="" value={Address} className="input" onChange={e => SetAddress(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="field mb-0">
                        <div className="field-cap">Gender</div>
                        <div className="field-wrap">
                            {/*The Server Expects Boolean True for Male and Boolean False for female */}
                            <select className="select" value={Gender === null ? 'both' : Gender ? 'male': 'female' }
                                onChange={e => SetGender(e.target.value === 'male' ? true :
                                    e.target.value === 'both' ? null : false)}>
                                <option value={"male"}>Male</option>
                                <option value={"female"}>Female</option>
                                <option value={"both"}>Both</option>
                            </select>
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
    query: paginationSet.Query
});

const mapDispatchToProps = dispatch => ({
    AddCustomers: customers => dispatch(AddEntity(customers, "Customers")),
    QuerySetter: query => dispatch(SetQuery(query))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomerManagerQueryGen));
