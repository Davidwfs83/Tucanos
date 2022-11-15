import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetUserImage } from '../../services/ApiServices/ImageApi';
import customerDefault from '../../images/defaultCustomer.png';
import { FigureOutImageSrc } from '../../services/Utility';
import { UpdateSingleEntity } from '../../redux/PaginationSet/paginationset.actions';


const CustomerEntity = ({ id, firstName, lastName, address, phoneNu, gender, imgLink, userId, imgStr }) => {

    const dispatch = useDispatch();
    useEffect(() => {
        GetUserImage(userId).then(response => {
            
            dispatch(UpdateSingleEntity({ imgStr: response.data.info.imgStr }, "Customers", id, 'id'));
        }) }, [])
    
    return (
        <div className="item-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={FigureOutImageSrc(imgStr, customerDefault, imgLink)} />
                            {/*<img alt="" src={imgLink === null ? customerDefault : imgLink} />*/}
                        </div>
                        <div className="info-right">
                            <div className="field mb-0">
                                <div className="field-cap">ID
                                </div>
                                <div className="field-text">
                                    #{id}
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
                            {firstName}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Last Name
                        </div>
                        <div className="field-text">
                            {lastName}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Address
                        </div>
                        <div className="field-text">
                            {address}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Phone
                        </div>
                        <div className="field-text">
                            {phoneNu}
                        </div>
                    </div>
                </div>
                <div className="item-col">
                    <div className="field mb-0">
                        <div className="field-cap">Gender
                        </div>
                        <div className="field-text">
                            {gender ? 'Male' : 'Female'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CustomerEntity;
