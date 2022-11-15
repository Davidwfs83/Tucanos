import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AirlineDefault from '../../images/defaultAirline.png';
import { GetUserImage } from '../../services/ApiServices/ImageApi';
import { FigureOutImageSrc, ScoreStarCalculator } from '../../services/Utility';
import { UpdateSingleEntity } from '../../redux/PaginationSet/paginationset.actions';


const AirlineEntity = ({ Airline }) => {

    const dispatch = useDispatch();
    useEffect(() => {
        GetUserImage(Airline.userId).then(response => {

            dispatch(UpdateSingleEntity({ imgStr: response.data.info.imgStr }, "Airlines", Airline.airlineId, 'airlineId'));
        })
    }, [])
   
    return (
        <div className="item-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={FigureOutImageSrc(Airline.imgStr, AirlineDefault, Airline.imgLink)} />
                        </div>
                        <div className="info-right">
                            <div className="field mb-0">
                                <div className="field-cap">ID
                                </div>
                                <div className="field-text">
                                    {`#${Airline.airlineId}`}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="item-col" >
                    <div className="field mb-0">
                        <div className="field-cap">Airline Name
                        </div>
                        <div className="field-text">
                            {Airline.airlineName}
                        </div>
                    </div>
                </div>
                <div className="item-col" style={{ margin: "0 40px 0 40px" }}>
                    <div className="field mb-0">
                        <div className="field-cap">Airline Country
                        </div>
                        <div className="field-text">
                            {Airline.countryName}
                        </div>
                    </div>
                </div>
                <div className="item-col" style={{ marginLeft: "30px" }}>
                    <div className="field mb-0">
                        <div className="field-cap">OverAll Score
                        </div>
                        <div className="field-text">
                            {Airline.overAllScore} / 10 <br />
                            <div className="text-yellow">
                                {ScoreStarCalculator(Airline.overAllScore)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default AirlineEntity;