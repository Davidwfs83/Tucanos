import React from 'react';
import {  Route} from 'react-router-dom';
import AdminDataGeneratorGenerate from './DataGenerator/AdminDataGeneratorGenerate';
import AdminDataGeneratorClear from './DataGenerator/AdminDataGeneratorClear';
import UpdateRemoveCusPopUp from './CustomerManager/UpdateRemoveCusPopUp';
import { DashboardNavigation } from '../../../services/NavigationConstants';
import CreateCusPopUp from './CustomerManager/CreateCusPopUp';
import AdminMyDetailsPopUp from './AdminMyDetailsPopUp';
import CreateAirlinePopUp from './AirlineManager/CreateAirlinePopUp';
import UpdateRemoveAirlinePopUp from './AirlineManager/UpdateRemoveAirlinePopUp';
import CreateAdminPopUp from './AdminManager/CreateAdminPopUp';
import UpdateRemoveAdminPopUp from './AdminManager/UpdateRemoveAdminPopUp';
import CreateCountryPopUp from './CountryManager/CreateCountryPopUp';
import UpdateRemoveCountryPopUp from './CountryManager/UpdateRemoveCountryPopUp';

const AdminCenterPopUpsRouter = ({ level }) => {
    const PopUpsSelectorAccordingToLevel = () => {
        
        let routes = [];
        let i = 0;
        if (level >= 1) {
            
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelOne.CustomerManager.Url} render={() =>
                (<UpdateRemoveCusPopUp a />)} />));

            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelOne.AirlineManager.Url} render={() =>
                (<UpdateRemoveAirlinePopUp  />)} />));
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelOne.MyDetails.Url} component={AdminMyDetailsPopUp } />));
        }

        if (level >= 2) {
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelOne.CustomerManager.Url} render={CreateCusPopUp} />));

            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelOne.AirlineManager.Url} render={CreateAirlinePopUp} />));


        }
        if (level >= 3) {
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelThree.AdminManager.Url} render={() => (<UpdateRemoveAdminPopUp />)} />));
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelThree.AdminManager.Url} component={CreateAdminPopUp} />));
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelThree.CountryManager.Url} component={CreateCountryPopUp} />));
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelThree.CountryManager.Url} component={UpdateRemoveCountryPopUp} />));
        }
        if (level === 4) {
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelFour.DataGenerator.Url} component={AdminDataGeneratorGenerate} />));
            routes.push((<Route key={i++} path={DashboardNavigation.AdminLevelFour.DataGenerator.Url} component={AdminDataGeneratorClear} />));
        }
        return routes;
    };
    return (
        <div>
            {PopUpsSelectorAccordingToLevel()}
        </div>
    )
}

export default AdminCenterPopUpsRouter;