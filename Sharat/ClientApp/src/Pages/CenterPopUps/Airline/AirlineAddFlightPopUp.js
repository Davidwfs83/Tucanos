import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import { ExtractStatusAndMsgForSuccessPopup, ExtractStatusAndMsgForErrorPopup } from '../../../services/Utility';
import { CreateFlight } from '../../../services/ApiServices/AirlineApi';
import PopUpResponseMessage from '../../../components/CeneterPopUpBase/PopUpResponseMessage';
import defaultFlightImage from '../../../images/defaultFlight.png';
import CenterPopUpSkeleton from '../../../components/CeneterPopUpBase/CenterPopUpSkeleton';
import { isEmptyArr } from '../../../services/Utility';



let AirlineAddFlightPopUp = ({ responseBox, countries, AirlineId }) => {
    const [OriginCountryId, SetOriginCountry] = useState(0);
    const [DestinationCountryId, SetDestinationCountry] = useState(0);
    const [Price, SetPrice] = useState();
    const [DepartureTime, SetDepartureTime] = useState();
    const [LandingTime, SetLandingTime] = useState();
    const [RemainingTickets, SetRemainingTickets] = useState();

    const dispatch = useDispatch();

     // Intialize datepicker bootstrap
    useEffect(() => {
        window.$('#datepicker3').datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            window.$('#datepicker3input').change();
        });
        window.$('#datepicker3input').change(e => {
            SetDepartureTime(e.target.value);
        });
        window.$('#datepicker4').datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            window.$('#datepicker4input').change();
        });
        window.$('#datepicker4input').change(e => {
            SetLandingTime(e.target.value);
        });
    }, []);

    // Since The country Id is a required field in the request, we want to have the first id
    // Of the array as the default value the moment the component has access to the countries array
    useEffect(() => {
        if ((OriginCountryId === 0 || DestinationCountryId === 0) && !(isEmptyArr(countries)) ) {
            SetOriginCountry(countries[0].id);
            SetDestinationCountry(countries[0].id);
        }
    });

    const buttonOnClick = () => {
        const newFlightObj = {
            AirlineId,
            OriginCountryId,
            DestinationCountryId,
            Price,
            DepartureTime,
            LandingTime,
            RemainingTickets
        };
        console.log(newFlightObj);
        CreateFlight(newFlightObj).then(response => {
            ExtractStatusAndMsgForSuccessPopup(response, dispatch);
        }).catch(error => {
            ExtractStatusAndMsgForErrorPopup(error, dispatch);
        })
    }
    return (
        <div>
            <h3 className="mb-4 text-center">Create Flight!</h3>
            {responseBox.isActive ? <PopUpResponseMessage message={responseBox.Msg} statusCode={responseBox.StatusCode} /> : null}
            

            <div className="avatar-small mb-1">
                <img alt="" src={defaultFlightImage} />
            </div>
            <div className="text-center mb-3 p-2">
                <a href="#"> Upload avatar</a>
            </div>

            <div className="row row-fix">
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Origin Country
                        </div>
                        <select className="select"
                            onChange={e => SetOriginCountry(parseInt(e.target.value))}>
                            {
                                countries.map(country =>
                                    OriginCountryId === country.id ?
                                        (<option
                                            key={country.id}
                                            value={country.id}
                                            selected
                                        >
                                            {country.name}
                                        </option>) :
                                        (<option
                                            key={country.id}
                                            value={country.id}
                                        >
                                            {country.name}
                                        </option>)
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Destination Country
                        </div>
                        <select className="select"
                            onChange={e => SetDestinationCountry(parseInt(e.target.value))}>
                            {
                                countries.map(country =>
                                    DestinationCountryId === country.id ?
                                        (<option
                                            key={country.id}
                                            value={country.id}
                                            selected
                                        >
                                            {country.name}
                                        </option>) :
                                        (<option
                                            key={country.id}
                                            value={country.id}
                                        >
                                            {country.name}
                                        </option>)
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Departure Time
                        </div>
                        <div className="input-group date" id="datepicker3">
                            <input type="text" id="datepicker3input" />
                            <span className="input-group-append" >
                                <span className="input-group-text bg-white" >
                                    <i className="fa fa-calendar"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Landing Time
                        </div>
                        <div className="input-group date" id="datepicker4">
                            <input type="text" id="datepicker4input" />
                            <span className="input-group-append" >
                                <span className="input-group-text bg-white" >
                                    <i className="fa fa-calendar"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Price
                        </div>
                        <input type="text"  value={Price}
                            onChange={e => SetPrice(parseInt(e.target.value))} className="input" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 col-fix">
                    <div className="field">
                        <div className="field-caption">
                            Intial Tickets Count
                        </div>
                        <input type="text" value={RemainingTickets}
                            onChange={e => SetRemainingTickets(parseInt(e.target.value))} className="input" />
                    </div>
                </div>
                
                <div className="control text-center">
                    <a href="#" className="button button-brand" onClick={buttonOnClick}>Create</a>
                    <a href="#" className="button button-danger">Cancel</a>
                </div>
            </div>

        </div>

    )

}


const mapStateToProps = ({ centerPopUp, paginationSet, auth }) => ({
    AirlineId: auth.currentUser.userInfo.Id,
    responseBox: centerPopUp.Response,
    countries: paginationSet.Entities.Countries
});
AirlineAddFlightPopUp = connect(mapStateToProps)(AirlineAddFlightPopUp);
export default CenterPopUpSkeleton(AirlineAddFlightPopUp, "airlineAddFlight");
