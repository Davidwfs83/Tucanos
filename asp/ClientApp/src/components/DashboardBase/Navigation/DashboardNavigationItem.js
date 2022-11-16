import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';

const DashboardNavigationItem = (props) => {
    
    return (
        <li className={props.location.pathname === props.urlLink ? 'active' : ''}>
            <Link to={props.urlLink}>
                <div className="icon"><i className="fa-solid fa-rectangle-history-circle-user"></i></div>
                {props.title}
            </Link>
        </li>
    )
}
export default withRouter(DashboardNavigationItem);
