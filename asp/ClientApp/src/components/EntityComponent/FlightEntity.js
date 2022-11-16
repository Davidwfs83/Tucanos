import React from 'react';
import { DateTimeToDateAndTimeParser } from '../../services/Utility';
import RedPlane from '../../images/flight-red.png';
import GreenPlane from '../../images/flight-green.png';
import Yellowlane from '../../images/flight-yellow.png';

const FlightEntity = ({ id, airlineName, originCountry, destinationCountry, price, departureTime, landingTime }) => {

    var parsedDepartureTime = DateTimeToDateAndTimeParser(departureTime);
    var parsedLandingTime = DateTimeToDateAndTimeParser(landingTime);
    const image = determineFlightImage();
    function determineFlightImage() {
        var now = Date.now();
        var departure = Date.parse(departureTime);
        var landing = Date.parse(landingTime);
        if (departure > now)
            return GreenPlane;
        if (departure < now && now < landing)
            return Yellowlane
        else
            return RedPlane
    }
    
    return (
        <div className="item-flight-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={image} />
                        </div>
                        <div className="info-right">
                            <div className="field mb-0">
                                <div className="field-cap">ID
								</div>
                                <div className="field-text">
                                    {`#${id}`}
								</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Airline Name
						</div>
                        <div className="field-text">
                            {airlineName}
						</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Departure date
						</div>
                        <div className="field-text">
                            {parsedDepartureTime.Date}<br /> {parsedDepartureTime.Time}
						</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Landing date
						</div>
                        <div className="field-text">
                            {parsedLandingTime.Date} <br /> {parsedLandingTime.Time}
					    </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Origin country
					    </div>
                        <div className="field-text">
                            {originCountry}
		                </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Landing country
					    </div>
                        <div className="field-text">
                            {destinationCountry}
						</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Price
				        </div>
                        <div className="field-text">
                            {price} $
						</div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default FlightEntity;