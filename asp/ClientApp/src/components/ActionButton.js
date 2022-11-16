import React from 'react';

const DashboardActionButton = ({ buttonText, buttonClick }) => {
    return (
        <div>
            <div className="field mb-0">
                <div className="field-wrap">
                    <button className="button button-brand" id="button-add-admin" onClick={buttonClick} >
                        <i className="fa fa-solid fa-plus-circle mr-2"></i>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default DashboardActionButton;