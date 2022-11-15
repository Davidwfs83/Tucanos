import React, { useEffect, useState } from 'react';
import * as jQuery from 'jquery';
import { connect } from 'react-redux';
import reviewDefault from '../../../images/defaultReview.png';
import customerDefault from '../../../images/defaultCustomer.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { FigureOutImageSrc, ScoreStarCalculator } from '../../../services/Utility';
import { ResetPopUpData } from '../../../redux/CenterPopUp/ceneterpopup.actions';

let ReviewPopUp = ({ reviewInfo, popUpType ,ResetPopUp }) => {
    const [Img, SetImg] = useState(null);
    const [ImgLink, SetImgLink] = useState(null);

   

    useEffect(() => {

        window.jQuery('#ReviewPopUp').on('hidden.bs.modal', () => {
            ResetPopUp();

        });
    }

        , []);

    return (
        <div>
            {
                popUpType === "Review" ? (
                    <div>

                        <div className="avatar-large mb-3">

                            <img alt="" src={reviewDefault} />
                        </div>

                        <div className="d-flex align-items-center">

                            <div className="avatar-small mb-3 flex-shrink-0">
                                <img alt="" src={FigureOutImageSrc(reviewInfo.customerFk.imgByteArr, customerDefault, reviewInfo.customerFk.imgLink)} />
                            </div>
                            <div className="w-100 pl-3">
                                <div className="text-left">
                                    <h5 className="mb-0">{reviewInfo.customerFk.firstName}{" " + reviewInfo.customerFk.lastName}</h5>
                                    <p>{reviewInfo.airlineFk.name}</p>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="field">

                                    <div className="field-text text-center">
                                        <strong className="score-text">{reviewInfo.score}</strong>
                                    </div>
                                    <div className="text-yellow">
                                        {ScoreStarCalculator(reviewInfo.score)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <div className="field-cap">
                                Review
                            </div>
                            <div className="field-text">
                                {reviewInfo.description}
                            </div>

                        </div>
                    </div>) : null
            }
        </div>
    )
}

const mapStateToProps = ({ centerPopUp}) => ({
    reviewInfo: centerPopUp.PopUpInfo,
    popUpType: centerPopUp.PopUpType
});


const mapDispatchToProps = dispatch => ({
    ResetPopUp: () => dispatch(ResetPopUpData())
});


ReviewPopUp = connect(mapStateToProps, mapDispatchToProps)(ReviewPopUp);
export default CenterPopUpSkeleton(ReviewPopUp, "ReviewPopUp")