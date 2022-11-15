import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import RegisterCustomer from './RegisterCustomer';
import { useDispatch } from 'react-redux';
import RegisterAirline from './RegisterAirline';
import { ResetAll } from '../../../redux/PageStaticData/pagestaticdata.action';
import './RegisterPage.css';
import CustomerCreationRecipt from './CustomerCreationRecipt';
import AirlineCreationRecipt from './AirlineCreationRecipt';




const RegisterPage = ({ newCustomer, newAirline}) => {
    const dispatch = useDispatch();

    // Set Page Title
    useEffect(() => {
        document.title = 'Tucanos - Register'
    }, [])

    useEffect(() => {
        return () => {
            dispatch(ResetAll());
        }
    }, [])
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>  
                    <div className="dashboard-title-component">
                        <h3 className="mb-3">Register page</h3>
                    </div>
                </div>              
            </div>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-toggle="tab" href="#customer" role="tab">Customer</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#airline" role="tab">Airline</a>
                </li>
            </ul>
            <div className="tab-content">
                {newCustomer === "" ? (<RegisterCustomer />) : (<CustomerCreationRecipt/>)}
                {newAirline === "" ? (<RegisterAirline />) : (<AirlineCreationRecipt/>)}               
            </div >
        </div >
    )
}

const mapStateToProps = ({ staticData }) => ({
    newCustomer: staticData.SlotOne.SlotType,
    newAirline: staticData.SlotTwo.SlotType,
});



export default connect(mapStateToProps)(RegisterPage);