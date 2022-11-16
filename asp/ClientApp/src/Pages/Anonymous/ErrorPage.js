import React, {useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrImage from '../../images/404.png';
import { AnonymousNavigation } from '../../services/NavigationConstants';

const ErrorPage = () => {
    // Set Page Title
    useEffect(() => {
        document.title = 'Tucanos - Error Page'
    }, [])
    return (
        <div className="max900">
            <div className="welcome text-center pt-5 pb-5">
                <div className="max150">
                    <img alt="" src={ErrImage} />
                </div>
                <h1 className="text-404 pt-3">Oops!!</h1>
                <h6 className="pt-0 pb-4 text-second font-normal ">It seems our servers incountered an issue, <br />
                    Please visit us at Tucanos at a later occasion!
                </h6>
                <Link to={AnonymousNavigation.RootUrl} className="button button-brand"> Back to Home </Link>
            </div>
        </div>
    )
}





export default ErrorPage;