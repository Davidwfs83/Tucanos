import React, { useEffect } from 'react';
import RecieptBackgroundImg from '../../../images/wooden_background.png';
import Logo from '../../../images/logo.png';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginAction } from '../../../redux/Auth/auth.actions';
import { FigureOutImageSrc } from '../../../services/Utility';
import { DashboardNavigation } from '../../../services/NavigationConstants';



const CustomerCreationRecipt = ({ newCustomer, history }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            loginAction(newCustomer.Username, newCustomer.Password, history)(dispatch);
            history.push(DashboardNavigation.Default);
        }, 6000);
    }, []);
    return (
        <div className="tab-pane fade show active" id="customer" role="tabpanel">
            <div className="pt-1">
                <div className="registertitle">{newCustomer.RespMsg}</div>
                <div className="imgp" style={{ marginTop: "30px" }}>

                    <img alt="" className="img"
                        src={FigureOutImageSrc(newCustomer.ImgStr, Logo, null)} />
                </div>
                <div className="row row-fix recipt-comp" style={{
                    backgroundImage: `url(${RecieptBackgroundImg})`
                }} >
                    
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                First Name
                            </div>
                            <div className="regfield-text">
                                {newCustomer.FirstName}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Last Name
                            </div>
                            <div className="regfield-text">
                                {newCustomer.LastName}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Address
                            </div>
                            <div className="regfield-text">
                                {newCustomer.Address}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Phone number
                            </div>
                            <div className="regfield-text">
                                {newCustomer.PhoneNo}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Credit card
                            </div>
                            <div className="regfield-text">
                                {newCustomer.CreditCard}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Gender
                            </div>
                            <div className="regfield-text">
                                {newCustomer.Gender ? 'Male' : 'Female'}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Username
                            </div>
                            <div className="regfield-text">
                                {newCustomer.Username}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Password
                            </div>
                            <div className="regfield-text">
                                {newCustomer.Password}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-12 col-fix">
                        <div className="regfield">
                            <div className="regfield-cap">
                                Email
                            </div>
                            <div className="regfield-text">
                                {newCustomer.Email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = ({ staticData }) => ({
    newCustomer: staticData.SlotOne.SlotInfo
});



export default withRouter(connect(mapStateToProps)(CustomerCreationRecipt));
