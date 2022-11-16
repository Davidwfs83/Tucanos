import React, {useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import CustomerPopUpsRouter from './Customer/CustomerPopUpsRouter';
import AirlineCenterPopUpsRouter from './Airline/AirlineCenterPopUpsRouter';
import AdminCenterPopUpsRouter from './Admin/AdminCenterPopUpsRouter';
import AnonymousCenterPopUpsRouter from './Anonymous/AnonymousCenterPopUpsRouter';
import { connect } from 'react-redux';



const CenterPopUpsRouter = ({ user }) => {

    

    const RouteSelector = () => {
        if (user === null)
            return;

        if (user.userType === 'Customer') {
            return (
                <div>
                    <CustomerPopUpsRouter />
                </div>
            )
        }
        else if (user.userType === 'Airline') {
            return (
                <div>
                    <AirlineCenterPopUpsRouter />
                </div>
            )
        }
        else if (user.userType === 'Admin') {
            return (
                <div>
                    <AdminCenterPopUpsRouter level={user.userInfo.Level} />
                </div>
            )
        }
    };
    return (
        <div >
            <AnonymousCenterPopUpsRouter userType={user.userType } />
            {RouteSelector()}
        </div>
    )
}


const mapStateToProps = ({ auth }) => ({
    user: auth.currentUser
});
export default withRouter(connect(mapStateToProps)(CenterPopUpsRouter));