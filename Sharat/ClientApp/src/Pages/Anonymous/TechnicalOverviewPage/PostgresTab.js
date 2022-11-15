import React from 'react';

const PostgresTab = () => {
    return (
        <div className="tab-pane fade" id="postgres" role="tabpanel">
            <div className="pt-1">
                <div className="block techtab">
                    <h1 className="small-title">General</h1>
                    <div className="sec">
                        The Postgres Database Holds All The Entities Presented in The App, The Daos (Data Access Objects)
                        That Communicate With it Does So Only Trough Stored Procedures or Functions As Some May Call It,
                        And Because of Decoupled The Nature of The App Achived Mostly By Interfaces We Can Expect a Smooth
                        Transition If One Day We Wish To Swich Over To Another Database.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostgresTab;