import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AirlineUpdateDetailsPopUp from './AirlineUpdateDetailsPopUp';
import { DashboardNavigation } from '../../../services/NavigationConstants';
import AirlineAddFlightPopUp from './AirlineAddFlightPopUp';
import AirlineDisplayFlightPopUp  from './AirlineDisplayFlightPopUp';

const AirlineCenterPopUpsRouter = () => {
    return (
        <div>
            <Route path={DashboardNavigation.Airline.MyDetails.Url} component={AirlineUpdateDetailsPopUp} />
            <Route path={DashboardNavigation.Airline.MyFlights.Url} component={AirlineAddFlightPopUp} />
            <Route path={DashboardNavigation.Airline.MyFlights.Url} component={AirlineDisplayFlightPopUp} />
        </div>
       
    )
}
export default AirlineCenterPopUpsRouter;