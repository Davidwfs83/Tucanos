import React from 'react';
import DashboardNavigationItem from './DashboardNavigationItem';
import { DashboardNavigation } from '../../../services/NavigationConstants';

const DashboardNavigator = (props) => {
    const renderSwitch = () => {
        var i = 0;
        var currentObj = {};
        var navItems = [];
        if (props.user.userType === 'Customer')
        {
            currentObj = DashboardNavigation.Customer;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
        }
        if (props.user.userType === 'Airline')
        {
            currentObj = DashboardNavigation.Airline;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
        }
        if (props.user.userType === 'Admin' && props.user.userInfo.Level >= 1)
        {
            currentObj = DashboardNavigation.AdminLevelOne;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
        }
        if (props.user.userType === 'Admin' && props.user.userInfo.Level >= 2)
        {
            currentObj = DashboardNavigation.AdminLevelTwo;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
            
        }
        if (props.user.userType === 'Admin' && props.user.userInfo.Level >= 3) {
            currentObj = DashboardNavigation.AdminLevelThree;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
        }
        if (props.user.userType === 'Admin' && props.user.userInfo.Level >= 4) {
            currentObj = DashboardNavigation.AdminLevelFour;
            for (const key in currentObj) {
                navItems.push((
                    <DashboardNavigationItem key={i++} title={currentObj[key].title} urlLink={currentObj[key].Url} />
                ));
            }
        }
        
        return navItems;
    }
    return (       
        <section className="navigation-component">
            <div className="scroll">
                <div className="sidebar-flex">
                    <div className="top">
                        <div className="menu">
                            <ul>
                                {renderSwitch()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default DashboardNavigator;