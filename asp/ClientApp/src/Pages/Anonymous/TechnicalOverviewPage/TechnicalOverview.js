import React, { useEffect } from 'react';
import Logo from './../../../images/logo.png';
import AspTab from './AspTab';
import PostgresTab from './PostgresTab';
import ReactJsTab from './ReactJsTab';
import AzureTab from './AzureTab';
import './TechinicalOverview.styles.css';

const TechnicalOverview = () => {
    // Set Page Title
    useEffect(() => {
        document.title = 'Tucanos - Technical Overview'
    }, [])
    return (
        <div>
            <div className="max900">
                <div className="text-center pt-5 pb-5">
                    <div className="max400">
                        <img alt="" src={Logo} />
                    </div>
                    <h1 className="pt-4 pb-5">Technical Overview</h1>
                    <div className="intro-text">
                        The Tucanos Web App Is Meant To Serve As a Portfolio Project For My CV. 
                        Below You'll Find a Detailed Description of Each of the 4 Main Components 
                        On Which The App Is Based Upon. I Haven't Published The Source Code 
                        Publicly Because of Copyright Concerns, That Said if Your'e a Potential 
                        Recruiter or Collaboretor email me at: dwaismannd@gmail.com and After 
                        A Quick Verficiation You'll get Access to the Source Repository(A Swift 
                        Response Time on this Guranteed!)
                    </div>
                </div>
                <div className="max1100" >
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#asp" role="tab">Server - ASP.NET Core</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#postgres" role="tab">Database - PostgreSQL</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#reactjs" role="tab">FrontEnd - ReactJS</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#azure" role="tab">Cloud - Azure</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <AspTab />
                        <PostgresTab />
                        <ReactJsTab />
                        <AzureTab />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TechnicalOverview;