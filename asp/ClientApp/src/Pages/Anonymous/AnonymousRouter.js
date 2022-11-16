import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Homepage from './HomePage/Homepage';
import FlightSearchEngine from './FlightSearchEngine/FlightSearchEngine';
import { AnonymousNavigation } from '../../services/NavigationConstants';
import RegisterPage from './RegisterPage/RegisterPage';
import SingeFlightPage from './SingeFlightPage/SingleFlightPage';
import ErrorPage from './ErrorPage';
import TechnicalOverview from './TechnicalOverviewPage/TechnicalOverview';


const AnonymousRouter = (props) => {
    function FlightSearchQueryValidator(props) {

        var QueryObject = queryString.parse(props.location.search);
        for (var key in QueryObject) {
            if (key !== "AllowedAirlinesIds" &&
                key !== "AllowedOriginCountriesIds" &&
                key !== "AllowedDestinationCountriesIds" &&
                key !== "DepartureTime" &&
                key !== "LandingTime" &&
                key !== "MinPrice" &&
                key !== "MaxPrice")
                return (<Redirect to={AnonymousNavigation.ErrorPage.Url} />)
        }
        return <FlightSearchEngine/>
    }
    return (
        <Switch>
            <Route exact path={AnonymousNavigation.Homgepage.Url} component={Homepage} />
            <Route exact path={AnonymousNavigation.FlightSearch.Url} render={FlightSearchQueryValidator} />
            <Route exact path={AnonymousNavigation.RegisterPage.Url} component={RegisterPage} />
            <Route exact path={AnonymousNavigation.SingleFlight.Url} component={SingeFlightPage} />
            <Route exact path={AnonymousNavigation.ErrorPage.Url} component={ErrorPage} />
            <Route exact path={AnonymousNavigation.TechnicalOverview.Url} component={TechnicalOverview} />
        </Switch>
    )
}

export default withRouter(AnonymousRouter);