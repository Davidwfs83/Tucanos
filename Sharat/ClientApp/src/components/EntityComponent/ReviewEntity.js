import React from 'react';
import reviewDefault from '../../images/defaultReview.png';
import { FigureOutImageSrc, ScoreStarCalculator } from '../../services/Utility';

const ReviewEntity = ({ review }) => {
    

    return (
        <div className="item-single-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        
                        <div className="avatar-component">
                            <img alt="" src={FigureOutImageSrc(review.customerFk.imgByteArr, reviewDefault, review.customerFk.imgLink)} />
                        </div>

                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">First Name
										</div>
                        <div className="field-text">
                            {review.customerFk.firstName }
										</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Last Name
										</div>
                        <div className="field-text">
                            {review.customerFk.lastName}
										</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Review Score
                        </div>
                        <div className="field-text">
                            {review.score} / 10 <br />
                            <div className="text-yellow">
                                {ScoreStarCalculator(review.score)}
                                </div>
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Review
										</div>
                        <div className="field-text">
                            {review.description.slice(0,30) + "..." }
										</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewEntity;