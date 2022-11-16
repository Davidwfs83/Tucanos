import React from 'react';

const ReactJsTab = () => {
    return (
        <div className="tab-pane fade" id="reactjs" role="tabpanel">
            <div className="pt-1">
                <div className="block techtab">
                    <h1 className="small-title">General</h1>
                    <div className="sec">
                        The Frontend Is Constructed Using The React Library, The Code Is Separeted
                        Into Logical Components To Match The Decoupled Nature Of The Backend.
                    </div>
                    <h1 className="small-title">Additional Libraries</h1>
                    <div className="row row-fix sec">
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Redux
                            </h2>
                            Like Most React Apps We Use Redux To Manage The Inner State Of The Page.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Mapbox Mapping Api
                            </h2>
                            Used To Present A Visual Flight Path Of The Flights Offered in The App.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Stripe Payment Api
                            </h2>
                            Used To Simulate The Purchase Of Tickets Within The App.
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReactJsTab;