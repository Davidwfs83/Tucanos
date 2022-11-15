import React from 'react';
import { DashboardNavigation } from '../../services/NavigationConstants';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import AirlineMyDetails from './AirlineMyDetails';
import AirlineMyFlights from './AirlineMyFlights';

const AirlineRouter = () => {
    return (
        <Switch>
            <Route path={DashboardNavigation.Airline.MyDetails.Url} component={AirlineMyDetails} />
            <Route path={DashboardNavigation.Airline.MyFlights.Url} component={AirlineMyFlights} />
        </Switch>
    )
}
export default AirlineRouter;