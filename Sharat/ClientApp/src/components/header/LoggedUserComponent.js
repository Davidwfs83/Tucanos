import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../../redux/Auth/auth.actions';
import { AnonymousNavigation, DashboardNavigation } from '../../services/NavigationConstants';
import customerDefault  from '../../images/defaultCustomer.png';
import airlineDefault from '../../images/defaultAirline.png';
import adminDefault from '../../images/defaultAdmin.png';
import { FigureOutImageSrc } from '../../services/Utility';

const LoggedUserComponent = ({ user, history, image }) => {
    const dispatch = useDispatch();
    
    const determineImage = () => {
        if (user.userType === 'Customer')
            return (
                <div >
                    <img alt="" style={{ backgroundColor: "#ffffff" }}
                        src={FigureOutImageSrc(image, customerDefault, user.userInfo.ImgLink)} />
                </div>
            )
        else if (user.userType === 'Airline')
            return (
                <div >
                    <img alt="" style={{ backgroundColor: "#ffffff" }}
                        src={FigureOutImageSrc(image, airlineDefault, user.userInfo.ImgLink)} />
                </div>
            )        
        else if (user.userType === 'Admin')
            return (
                <div >                    
                    <img alt="" style={{ backgroundColor: "#ffffff" }}
                        src={FigureOutImageSrc(image, adminDefault, user.userInfo.ImgLink)} />
                </div>
            )
        else
            //dispatch(logout(history));
        return;        
    }
    
    const determineName = () => {
        if (user.userType === 'Customer')
            return (<h5 className="mb-3">{user.userInfo.FirstName}</h5>)
        else if (user.userType === 'Airline')
            return (<h5 className="mb-3">{user.userInfo.Name}</h5>)
        else if (user.userType === 'Admin')
            return (<h5 className="mb-3">{user.userInfo.FirstName}</h5>)
        else
            //dispatch(logout(history));
        return;
    }
    return (
        <div className='user-component' style={{ backgroundColor:"#ffffff" }}>
            <div className='dropdown-toggle' data-toggle='dropdown'>
                <div className='avatar'>
                    {determineImage()}
                </div>
            </div>
            <div className="dropdown-menu">
                <div className="logged-component">
                    <div className="avatar">
                        {determineImage()}
                        </div>
                    {determineName()}
                    <ul>
                        <li ><Link to={DashboardNavigation.Default}><i className="fa-solid fa-house"></i>Dashboard</Link></li>
                        <li onClick={() => dispatch(logout(history))}>
                            <Link to={AnonymousNavigation.RootUrl}>
                                <i className='fa-solid fa-arrow-right-from-bracket'></i>                                
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state) => {
    return {
        user: state.auth.currentUser,
        image: state.auth.Image
    };
};
export default withRouter(connect(mapStateToProps)(LoggedUserComponent));