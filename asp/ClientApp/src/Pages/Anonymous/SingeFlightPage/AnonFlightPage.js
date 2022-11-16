import React, { useEffect } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import ReviewEntity from '../../../components/EntityComponent/ReviewEntity';
import AirlineEntity from '../../../components/EntityComponent/AirlineEntity';
import { LoadPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';
import { isEmptyArr } from '../../../services/Utility';
import PaginationSetNoResult from '../../../components/PaginationSetNoResult';
import PageTitle from '../../../components/PageTitle';


const AnonFlightPage = ({ Airline, Reviews, LoadReviewToPopUp }) => {



    return (
        <div>
            <PageTitle title="The Airline"/>
            <div className="block mb-4 mt-5">
                {
                    Airline.SlotType === "Airline" ?
                        (<AirlineEntity Airline={Airline.SlotInfo} />) : null
                }
                
            </div>
            <PageTitle title="The Reviews" />
            <div className="block">

                {
                    (isEmptyArr(Reviews.EntityData) || (Reviews.EntityType !== 'Reviews')) ?
                        (<PaginationSetNoResult />) :
                        (
                            Reviews.EntityData.map(review =>
                            (
                                <div key={review.id} onClick={() => {
                                    LoadReviewToPopUp(review);
                                    window.$('#ReviewPopUp').modal('show');
                                }}>
                                    <ReviewEntity
                                        
                                        review={review}
                                    />
                                </div>
                            )
                            )
                        )
                }

            </div>
        </div>
    )
}

const mapStateToProps = ({ staticData, paginationSet }) => ({
    Airline: staticData.SlotTwo,
    Reviews: paginationSet.CurrentEntities
});


const mapDispatchToProps = dispatch => ({
    LoadReviewToPopUp: review => dispatch(LoadPopUpData(review, "Review"))
});


export default connect(mapStateToProps, mapDispatchToProps)(AnonFlightPage);



