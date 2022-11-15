import React, {  useEffect } from 'react';
import { connect} from 'react-redux';
import { useDispatch } from 'react-redux';
import AirlineDefaultImg from '../../images/defaultAirline.png';
import { GetMyDetails } from '../../services/ApiServices/AirlineApi';
import { ScoreStarCalculator } from '../../services/Utility';
import PageTitle from '../../components/PageTitle';
import { LoadFirst, ResetAll } from '../../redux/PageStaticData/pagestaticdata.action';
import { FigureOutImageSrc } from '../../services/Utility';



const AirlineMyDetails = ({ airline}) => {
    
    const dispatch = useDispatch();
    // Set Page Title
    useEffect(() => {
        document.title = 'Dashboard - My Details'
    }, []);

    useEffect(() => {
        GetMyDetails().then(response => {
            dispatch(LoadFirst({
                AirlineId: response.data.info.airlineId,
                AirlineName: response.data.info.airlineName,
                CountryId: response.data.info.countryId,
                CountryName: response.data.info.countryName,
                Username: response.data.info.username,
                Email: response.data.info.email,
                ImgStr: response.data.info.imgByteArr,
                ImgLink: response.data.info.imgLink,
                OverAllScore: response.data.info.overAllScore
            }));
        });
        return () => {
            // Reset Static Data Slots
            dispatch(ResetAll());
        }
    }, []);
  
    return (
        <div className="max900">
            <div className="d-flex justify-content-between mb-2">
                <PageTitle title={"My Details"} />
                <div className="field mb-0">
                    <div className="field-wrap">
                        <button className="button button-brand" data-toggle="modal" data-target="#airlineUpdateDetails">
                            <i className="fa fa-solid fa-plus-circle mr-2"></i>
                                    Update Info!
                            </button>
                    </div>
                </div>
            </div>
            <div className="block mydetails-block">
                <div className="text-center">
                    <div className="avatar-small mb-1  mb-3">
                        <img alt="" src={FigureOutImageSrc(airline.ImgStr, AirlineDefaultImg, airline.ImgLink)} />
                    </div>
                </div>
                <div className="text-center">
                    <div className="field">
                        <div className="field-cap">ID
								</div>
                        <div className="field-text">
                            #{airline.AirlineId}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Name
								</div>
                        <div className="field-text">
                            {airline.AirlineName}
                        </div>
                    </div>

                    <div className="field">
                        <div className="field-cap">Country
								</div>
                        <div className="field-text">
                            {airline.CountryName}
                        </div>
                    </div>

                    <div className="field">
                        <div className="field-cap">Overall score
								</div>
                        <div className="field-text">
                            {airline.OverAllScore} / 10 <br />
                            <div className="text-yellow">
                                {ScoreStarCalculator(airline.OverAllScore)}
                            </div>
                        </div>

                        {/*<div className="field-text">*/}
                        {/*    {Airline.overAllScore} / 10 <br />*/}
                        {/*    <div className="text-yellow">*/}
                        {/*        {ScoreStarCalculator(Airline.overAllScore)}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="field">
                        <div className="field-cap">Username
								</div>
                        <div className="field-text">
                            {airline.Username}
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-cap">Email
								</div>
                        <div className="field-text">
                            {airline.Email}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}


const mapStateToProps = ({ staticData }) => ({
    airline: staticData.SlotOne.SlotInfo
});


export default connect(mapStateToProps)(AirlineMyDetails);