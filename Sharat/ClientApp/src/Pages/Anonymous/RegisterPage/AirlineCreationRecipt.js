import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import RecieptBackgroundImg from '../../../images/wooden_background.png';
import { withRouter } from 'react-router-dom';
import Logo from '../../../images/logo.png';
import { FigureOutImageSrc } from '../../../services/Utility';
import { DashboardNavigation } from '../../../services/NavigationConstants';



const AirlineCreationRecipt = ({ newAirline, history }) => {
    useEffect(() => {
        setTimeout(() => {
            loginAction(newCustomer.Username, Password, history);
            history.push(DashboardNavigation.Default);
        }, 6000);
    }, []);
    return (
        <div className="tab-pane fade show active" id="customer" role="tabpanel">
            <div className="pt-1">
                <div className="registertitle">#{newAirline.RespMsg}</div>
                <div className="imgp" style={{ marginTop: "30px" }}>

                    <img alt="" className="img"
                        src={FigureOutImageSrc(newAirline.ImgStr, Logo, null)} />
                </div>
                <div className="row row-fix recipt-comp" style={{
                    backgroundImage: `url(${RecieptBackgroundImg})`
                }}>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Company Name
                            </div>
                            <div className="regfield-text">
                                {newAirline.CompanyName}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Country Name
                            </div>
                            <div className="regfield-text">
                                {newAirline.CountryName}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Username
                            </div>
                            <div className="regfield-text">
                                {newAirline.Username}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Password
                            </div>
                            <div className="regfield-text">
                                {newAirline.Password}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Email
                            </div>
                            <div className="regfield-text">
                                {newAirline.Email}
                            </div>
                        </div>
                    </div>
                    {
                        newAirline.CompanyDescription !== "" ?
                            (
                                <div className="col-md-12 col-sm-12 col-12 col-fix">
                                    <div className="regfield">
                                        <div className="regfield-cap">
                                            Company Description
                                        </div>
                                        <textarea className="textarea">
                                            {newAirline.CompanyDescription}
                                        </textarea>
                                    </div>
                                </div>
                            )
                            :
                            null
                        }
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = ({ staticData }) => ({
    newAirline: staticData.SlotTwo.SlotInfo
});



export default withRouter(connect(mapStateToProps)(AirlineCreationRecipt));
