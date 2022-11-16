import React from 'react';

const AzureTab = () => {
    return (
        <div className="tab-pane fade" id="azure" role="tabpanel">
            <div className="pt-1">
                <div className="block techtab">
                    <h1 className="small-title">General</h1>
                    <div className="sec">
                        The Whole App is Hosted on the Microsoft Azure Cloud. The App Is Hosted Upon
                        3 Services: <br/>
                        - The First One And Main One Is the App Service Which Holds The ASP Server and The
                        React App. <br/>
                        - The Second is a Postgres Database Service Which Holds the Postgres DB.
                        - The Third is a Storage Service Which is a seprate Storage Used To Hold All The
                        Images Of The Entities of the App.
                    </div>
                    <h1 className="small-title">Coming Next!</h1>
                    <div className="row row-fix sec">
                        <div className="col-md-12 col-sm-12 col-12 col-fix licomp">
                            <h2 className="smaller-title">
                                Docker Image
                            </h2>
                            I Intend On Migrating The Whole App Service Into a Docker Image Which
                            Will Run on a Virtual Machine.
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AzureTab;