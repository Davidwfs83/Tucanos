import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import CustomerMyDetailsUpdate from './CustomerMyDetailsUpdate';
import { DashboardNavigation } from '../../../services/NavigationConstants';
import CustomerTicketPopUp from './CustomerTicketPopUp';

const CustomerPopUpsRouter = (props) => {
    return (
        <Switch>
            <Route exact path={DashboardNavigation.Customer.MyDetails.Url} component={CustomerMyDetailsUpdate} />
            <Route exact path={DashboardNavigation.Customer.ActiveTickets.Url} component={CustomerTicketPopUp} />
            <Route exact path={DashboardNavigation.Customer.TicketHistory.Url} component={CustomerTicketPopUp} />
        </Switch>
    )
}
export default withRouter(CustomerPopUpsRouter);