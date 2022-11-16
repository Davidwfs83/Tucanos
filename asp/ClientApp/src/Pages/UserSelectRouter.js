import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import CustomerRouter from './Customer/CustomerRouter';
import AirlineRouter from './Airline/AirlineRouter';
import AdminRouter from './Admin/AdminRouter';
import AnonymousRouter from './Anonymous/AnonymousRouter';
import { connect } from 'react-redux';


const UserSelectRouter = ({ user }) => {


    const RouteSelector = () => {
        if (user === null)
            return;

        if (user.userType === 'Customer') {
            return (
                <div>
                    <CustomerRouter />
                </div>
            )
        }
        else if (user.userType === 'Airline') {
            return (
                <div>
                    <AirlineRouter />
                </div>
            )
        }
        else if (user.userType === 'Admin') {
            return (
                <div>
                    <AdminRouter />
                </div>
            )
        }
    };
    return (
        <div >
            <AnonymousRouter />
            {RouteSelector()}
        </div>
    )
}


const mapStateToProps = ({ auth }) => ({
    user: auth.currentUser
});
export default withRouter(connect(mapStateToProps)(UserSelectRouter));