import React from 'react';
import adminDefault from '../../images/defaultAdmin.png';


const AdminEntity = ({ adminId, firstName, lastName, level}) => {
    return (
        <div className="item-admin-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={adminDefault} />
                        </div>
                        <div className="info-right">
                            <div className="field mb-0">
                                <div className="field-cap">ID
												</div>
                                <div className="field-text">
                                    #{adminId }
												</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">First Name
										</div>
                        <div className="field-text">
                            {firstName }
										</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Last Name
										</div>
                        <div className="field-text">
                            {lastName }
										</div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Level
										</div>
                        <div className="field-text">
                            {level }
										</div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default AdminEntity;





