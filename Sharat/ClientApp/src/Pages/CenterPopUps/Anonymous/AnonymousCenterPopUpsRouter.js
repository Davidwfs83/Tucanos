import React from 'react';
import {  Route, Switch } from 'react-router-dom';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import InfoPopUp from './InfoPopUp';
import BuyTicketPopUp from './BuyTicketPopUp';
import ReviewPopUp from './ReviewPopUp';

const AnonymousCenterPopUpsRouter = ({ userType}) => {
    return (
        <div>
            <InfoPopUp />
                        
                <Route path={AnonymousNavigation.SingleFlight.Url} component={ReviewPopUp} />
                <Route exact path={AnonymousNavigation.Homgepage.Url} component={ReviewPopUp} />
                
                
                {userType === 'Customer' ?
                    (<Route path={AnonymousNavigation.SingleFlight.Url} component={BuyTicketPopUp} />) : null}
            
       
        </div>
    )
}

export default AnonymousCenterPopUpsRouter;
