import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetCountryImage } from '../../services/ApiServices/ImageApi';
import { FigureOutImageSrc } from '../../services/Utility';
import { UpdateSingleEntity } from '../../redux/PaginationSet/paginationset.actions';

import CountryDefault from '../../images/defaultCountry.png';


const CountryEntity = ({ id, name, imgStr }) => {

    const dispatch = useDispatch();
    useEffect(() => {
        GetCountryImage(id).then(response => {

            dispatch(UpdateSingleEntity({ imgStr: response.data.info.imgStr }, "Countries", id, 'id'));
        })
    }, [])
    return (
        <div className="item-admin-component">
            <div className="item-flex">
                <div className="item-col">
                    <div className="item-info">
                        <div className="avatar-component">
                            <img alt="" src={FigureOutImageSrc(imgStr, CountryDefault, null)} />
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
                        <div className="field-cap"> Name
										</div>
                        <div className="field-text">
                            {name}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
export default CountryEntity;





