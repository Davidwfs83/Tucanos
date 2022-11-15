import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { LoadPopUpData, ResetPopUpData } from '../../redux/CenterPopUp/ceneterpopup.actions';
import { ObjectDefaultValueCleaner } from '../../services/Utility';

const DataGenerator = (props) => {
    const [FlightsCount, SetFlights] = useState("");
    const [AirlinesCount, SetAirlines] = useState("");
    const [TicketsCount, SetTickets] = useState("");
    const [CustomersCount, SetCustomers] = useState("");
    const [ReviewsCount, SetReviews] = useState("");

    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - Data Generator'
    }, []);

    // Reset Center Pop Up section in redux store when bootstrap modal go backs into hiding
    useEffect(() => {
        window.$('#admin4DataGenGen').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
        window.$('#admin4DataGenClear').on('hidden.bs.modal', () => {
            props.ResetPopUp();
        });
    }, []);
    const generateGeneratorConstsObj = () => {
        var onlyDefinedFields = ObjectDefaultValueCleaner(
            {
                FlightsCount,
                AirlinesCount,
                TicketsCount,
                CustomersCount,
                ReviewsCount
            });
        for (const key in onlyDefinedFields) {
            onlyDefinedFields[key] = parseInt(onlyDefinedFields[key])
        }
        return onlyDefinedFields;
    }

    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <div>
                    <div className="dashboard-title-component">
                        <h3 className="mb-3">Data Generator</h3>
                    </div>
                </div>
                <div>
                    <div className="field mb-0">
                        <div className="field-wrap">
                        </div>
                    </div>

                </div>
            </div>
            <div className="block mb-4">
                <div className="row">
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-cap">Customer
									</div>
                            <div className="field-wrap">
                                <input type="number" placeholder="" value={CustomersCount} className="input"
                                    onChange={e => SetCustomers(e.target.value)}
                                    pattern="[1-100]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3">
                        <div className="field mb-3">
                            <div className="field-cap">Airline
									</div>
                            <div className="field-wrap">
                                <input type="number" placeholder="" value={AirlinesCount} className="input"
                                    onChange={e => SetAirlines(e.target.value)}
                                    pattern="[1-100]"
                                />
                            </div>
                        </div>
                    </div>
                   
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-cap">Flight
									</div>
                            <div className="field-wrap">
                                <input type="number" placeholder="" value={FlightsCount} className="input"
                                    onChange={e => SetFlights(e.target.value)}
                                    pattern="[1-100]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-cap">Reviews
                            </div>
                            <div className="field-wrap">
                                <input type="number" placeholder="" value={ReviewsCount} className="input"
                                    onChange={e => SetReviews(e.target.value)}
                                    pattern="[1-100]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="field mb-0">
                            <div className="field-cap">Ticket
									</div>
                            <div className="field-wrap">
                                <input type="number" placeholder="" value={TicketsCount} className="input"
                                    onChange={e => SetTickets(e.target.value)}
                                    pattern="[1-100]"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-3">
                        <div className="field mb-0">
                            <div className="field-cap">
									</div>
                            <div className="field-wrap">
                                
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-wrap">
                                <div className="field mb-0">
                                    <div className="field-cap"> &nbsp;
											</div>
                                    <div className="field-wrap">
                                        <button className="button button-brand w-100 confirm-button"
                                            data-toggle="modal" data-target="#admin4DataGenGen"
                                            onClick={() => props.GeneratePopUpLoadData(generateGeneratorConstsObj())}>
                                            <i className="fa-solid fa-gears mr-2"></i>
													Generate
										</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-wrap">
                                <div className="field mb-0">
                                    <div className="field-cap"> &nbsp;
											</div>
                                    <div className="field-wrap">
                                        <button className="button button-brand w-100 confirm-button"
                                            data-toggle="modal" data-target="#admin4DataGenClear"                                        >
                                            <i className="fa-solid fa-database mr-2"></i>
													Clear Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="field mb-3">
                            <div className="field-wrap">
                                <div className="field mb-0">
                                    <div className="field-cap"> &nbsp;
                                    </div>
                                    
                                    <select className="select" >
                                        <option >Dummy Api</option>
                                        <option>Warcraft Api</option>
                                        <option>Gibberish Api</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {

    return ({
        GeneratePopUpLoadData: (recordsCount) => dispatch(LoadPopUpData(recordsCount)),
        ResetPopUp: () => dispatch(ResetPopUpData())
    })
};
export default connect(null, mapDispatchToProps)(DataGenerator);