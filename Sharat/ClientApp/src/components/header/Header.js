import React from 'react';
import LoggedUserComponent from './LoggedUserComponent';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import UserComponent from './UserComponent';
import { AnonymousNavigation } from '../../services/NavigationConstants';


const Header = (props) => {
    return (
        <header className='header-component'>
            <div className='header-flex'>
                <div className='left' >
                    <div className="menu-icon">
                        <i className="fas fa-bars"></i>                      
                    </div>
                    {
                        props.isAuthenticated ?
                            <LoggedUserComponent /> :
                            <UserComponent />
                    }
                </div>
                <div className="middle">
                    <div className="logo-component" style={{ margin:"0px 0px 0px 0px" }}>
                        <Link to={AnonymousNavigation.Homgepage.Url} className="logo">
                            <img alt="" src={logo} />
                        </Link>
                    </div>
                </div>
                <div className="right">
                    <div className="menu-component">
                        <ul>
                            <li><Link to={AnonymousNavigation.TechnicalOverview.Url}>Technical Overview</Link></li>
                            <li><Link to={AnonymousNavigation.FlightSearch.Url}>{AnonymousNavigation.FlightSearch.title}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}



export default Header;