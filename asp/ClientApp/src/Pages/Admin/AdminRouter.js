import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DashboardNavigation } from '../../services/NavigationConstants';
import DataGenerator from './DataGenerator';
import CustomerManager from './CustomerManager/CustomerManager';
import AdminMyDetails from './AdminMyDetails';
import AirlineManager from './AirlineManager/AirlineManager';
import AdminManager from './AdminManager/AdminManager';
import CountryManager from './CountryManager/CountryManager';
import CountryManagerQueryGen from './CountryManager/CountryManagerQueryGen';

const AdminRouter = ({ user }) => {
    var AdminLevelRouteSelector = function () {
        var routes = [];
        var i = 0;
        if (user.Level === 4) {
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelFour.DataGenerator.Url} component={DataGenerator} />));
        }
        if (user.Level >= 3) {          
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelThree.CountryManager.Url} component={CountryManager} />));
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelThree.AdminManager.Url} render={() => (<AdminManager level={user.Level} />)} />));
        }
        if (user.Level >= 2) {
        }
        if (user.Level >= 1) {
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelOne.CustomerManager.Url} render={() => (<CustomerManager level={user.Level} />)} />));
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelOne.MyDetails.Url} component={AdminMyDetails} />));
            routes.push((<Route key={i++} exact path={DashboardNavigation.AdminLevelOne.AirlineManager.Url} render={() => (<AirlineManager level={user.Level} />)} />));
        }
        return routes;
    }
    return (
        <Switch>
            {AdminLevelRouteSelector()}
        </Switch>
    )
}

const mapStateToProps = ({ auth }) => ({
    user: auth.currentUser.userInfo
});
export default connect(mapStateToProps)(AdminRouter);




