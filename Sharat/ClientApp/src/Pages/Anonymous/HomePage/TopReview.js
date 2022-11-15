import React from 'react';
import customerDefault from '../../../images/defaultCustomer.png';

import { FigureOutImageSrc, ScoreStarCalculator } from '../../../services/Utility';






const TopReview = ({ review, click }) => {

    
    return (
        <div className="col-lg-4 col-md-12 col-12" onClick={ click}>
                <div className="avatar-small mb-3">
                <img alt="" src={FigureOutImageSrc(review.customerFk.imgByteArr, customerDefault, review.customerFk.imgLink) } />
                </div>
                <div className="text-center">
                    <h5 className="mb-0">{review.customerFk.firstName}{" " + review.customerFk.lastName}</h5>
                    <p>{review.airlineFk.name}</p>
                </div>

                <div className="row">
                    <div className="col-7">
                        <div className="field">
                            <div className="field-cap">
                                Review
                            </div>
                            <div className="field-text">
                                {
                                    review.description.slice(0, 25) + "..."
                                }
                            </div>

                        </div>
                    </div>
                    <div className="col-5">
                        <div className="field">
                            <div className="field-cap">
                                Score
                            </div>
                            <div className="field-text ">
                                <strong className="score-text">{review.score}</strong>
                            </div>
                            <div className="text-yellow">
                                {ScoreStarCalculator(review.score)}
                            </div>

                        </div>
                    </div>
                </div>
           
        </div>

    )
}

export default TopReview;