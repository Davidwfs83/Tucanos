import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import CustomerMyDetails from './CustomerMyDetails';
import CustomerTicketsHistory from './CustomerTicketsHistory';
import CustomerActiveTickets from './CustomerActiveTickets';
import { DashboardNavigation } from '../../services/NavigationConstants';
const CustomerRouter = () => {
    return (
        <Switch>
            <Route exact path={DashboardNavigation.Customer.MyDetails.Url} component={CustomerMyDetails} />
            <Route exact path={DashboardNavigation.Customer.ActiveTickets.Url} component={CustomerActiveTickets} />
            <Route exact path={DashboardNavigation.Customer.TicketHistory.Url} component={CustomerTicketsHistory} />
        </Switch>
    )

}
export default withRouter(CustomerRouter);