import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import WelcomeImage from '../../../images/welcome.svg';
import TopReview from './TopReview';
import { GetThreeRandReview } from '../../../services/ApiServices/AnonymousApi';
import { AnonymousNavigation } from '../../../services/NavigationConstants';
import { ResetPopUpData, LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { isEmptyArr } from '../../../services/Utility';
import ReadMeComponent from './ReadMeComponent';
import IntroText from './IntroText';
import './Homepage.css';

const Homepage = ({ history, isAuthenticated}) => {
    const [ThreeReviews, SetThreeReviews] = useState([]);
    const dispatch = useDispatch();

    // Set Page Title
    useEffect(() => {
        document.title = 'Tucanos - Home'
    },[])

    useEffect(() => {
        GetThreeRandReview()
            .then(response => SetThreeReviews(response.data.info))
            .catch(err => {                
                history.push(AnonymousNavigation.ErrorPage.Url);
            })
    }, [])

    useEffect(() => {
        window.$('#ReviewPopUp').on('hidden.bs.modal', () => {
            dispatch(ResetPopUpData());
        });
        return () => {
            dispatch(ResetPopUpData());

        }
    }, []);
    return (
        <div>
            {
                isAuthenticated ?
                    null : (<ReadMeComponent />)
            }
            <div className="max900">               
                <div className="welcome text-center pt-5 pb-5">                                       
                    <div className="max400">
                        <img alt="" src={WelcomeImage} />
                    </div>
                    <h1 className="pt-4 pb-5">Welcome to Tucanos!</h1>                       
                        <IntroText />                  
                </div>
            </div>
            <div className="max1100 review-component" >

                {
                    isEmptyArr(ThreeReviews) ? null :
                        (
                            <div className="row">
                                <TopReview review={ThreeReviews[0]} click={() => {
                                    dispatch(LoadPopUpData(ThreeReviews[0], "Review"));
                                    window.$('#ReviewPopUp').modal('show');
                                }} />
                                <TopReview review={ThreeReviews[1]} click={() => {
                                    dispatch(LoadPopUpData(ThreeReviews[1], "Review"));
                                    window.$('#ReviewPopUp').modal('show');
                                }} />
                                <TopReview review={ThreeReviews[2]} click={() => {
                                    dispatch(LoadPopUpData(ThreeReviews[2], "Review"));
                                    window.$('#ReviewPopUp').modal('show');
                                }} />
                            </div>
                        )
                }
            </div>

        </div>


    )
}

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: (!(auth.currentUser.userType === ""))
});
export default withRouter(connect(mapStateToProps)(Homepage));