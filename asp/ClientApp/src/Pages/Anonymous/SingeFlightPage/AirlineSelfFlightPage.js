import React from 'react';
import { connect } from 'react-redux';
import CustomerEntity from '../../../components/EntityComponent/CustomerEntity';
import PaginationSetNavigtaion from '../../../components/PaginationSetNavigation';

// This Component is to be rendered only if an airline is accesing a certain
// flight page and that flight BELONGS to that airline
const AirlineSelfFlightPage = ({ flight, tickets }) => {
    return (
        <div>
            <div className="block mb-4 mt-5">
                <div className="row">
                    <div className="col-6">
                        <div className="field mb-0">
                            <div className="field-cap">Flight ID
									</div>
                            <div className="field-text">
                                <strong className="score-text">
                                    #{flight === undefined ? null : flight.id}
                                </strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 text-right">
                        <div className="field mb-0">
                            <div className="field-cap">
                                Remaining Tickets
							</div>
                            <div className="field-text">
                                <strong className="score-text">
                                    {flight === undefined ? null : flight.remainingTickets}
                                    
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block">
                {
                    tickets.map(ticket =>
                    (
                        <CustomerEntity
                            key={ticket.ticketId}
                            {...ticket}
                            id={ticket.customerId}
                        />
                    )
                    )
                }
            </div>
            <PaginationSetNavigtaion />
        </div>

    )
}

const mapStateToProps = ({ staticData, paginationSet }) => ({
    flight: staticData.SlotOne.SlotInfo,
    tickets: paginationSet.CurrentEntities.EntityData
});


export default connect(mapStateToProps)(AirlineSelfFlightPage);