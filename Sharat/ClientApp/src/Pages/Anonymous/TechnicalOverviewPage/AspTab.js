import React from 'react';

const AspTab = () => {
    return (
        <div className="tab-pane fade show active" id="asp" role="tabpanel">
            <div className="pt-1">
                <div className="block techtab">
                    <h1 className="small-title">General</h1>
                    <div className="sec">
                        The ASP Server that runs the app is essentially the bread and butter of the application,
                        The Code is written in a Decoupled and Extensible Manner and Adhears common Design Principles.
                    </div>
                    <h1 className="small-title">Extra Features</h1>
                    <div className="row row-fix sec">
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Swagger Documentation API
                            </h2> 
                             Documents Requests Formats and Possible Responses Types.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Testing Unit
                            </h2> 
                             A DLL Dedicated To Continously Test the Communication Between the Server And the Database.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Logging Middleware
                            </h2> 
                             Logs Each and Every Request And Response That passes trough The ASP Pipeline.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Data Generation API
                            </h2> 
                             An API Aviable only to the Main Admin, Used To Create Dummy Data for The App.
                        </div>
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                JWT Authorization
                            </h2>
                            We Use The Json Web Token Technique To Perform Authroization And Authtentication Troughout
                            The App.
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default AspTab;