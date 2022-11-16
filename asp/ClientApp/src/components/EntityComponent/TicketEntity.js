import React from 'react';
import RedTicket from '../../images/ticket-red.png';
import YellowTicket from '../../images/ticket-yellow.png';
import GreenTicket from '../../images/ticket-green.png';
import { DateTimeToDateAndTimeParser } from '../../services/Utility';

const TicketEntity = ({ ticketId, airlineName, departureTime, landingTime, originCountryName, destinationCountryName, price}) => {
    var parsedDepartureTime = DateTimeToDateAndTimeParser(departureTime);
    var parsedLandingTime = DateTimeToDateAndTimeParser(landingTime);
    const determineTicketImage = () => {
        var now = Date.now();
        
        var departure = Date.parse(departureTime);
        var landing = Date.parse(landingTime);
        
        if (departure < now  && now < landing)
            return YellowTicket;
        if (departure > now)
            return GreenTicket;       
        else
            return RedTicket
    }
    return (
        <div className="item-flight-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={determineTicketImage()} />
                        </div>
                        <div className="info-right">
                            <div className="field mb-0">
                                <div className="field-cap">Ticket ID
								</div>
                                <div className="field-text">
                                    {`#${ticketId}`}
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
                            {parsedLandingTime.Date}<br /> {parsedLandingTime.Time}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Origin country
					    </div>
                        <div className="field-text">
                            {originCountryName}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Landing country
					    </div>
                        <div className="field-text">
                            {destinationCountryName}
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

export default TicketEntity;