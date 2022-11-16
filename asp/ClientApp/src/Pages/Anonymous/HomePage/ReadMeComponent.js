import React from 'react';
import mouseClickImg from '../../../images/mouseClick.png';




const ReadMeComponent = () => {
    return (
        <div className="readme-comp">
            <div className="readme-drop-btn" data-toggle="dropdown"  >
                <div className="readme-drop-btn-text">
                    <img className="mouse-img" src={mouseClickImg} />
                    <span>Click Me</span>
                    <img className="mouse-img" src={mouseClickImg} />
                </div>
            </div>
            <div className="dropdown-menu drop-comp">
                <div className="readme-text-sec">
                    In Order To Facilitate Your Introduction To Tucanos And To Allow You To Exprience
                    The Website From Each User Type Perspective, I Went Ahead And Created 3 "Placebo Users" For Your
                    Convenience.
                    <div className= "placebo-side-note">
                        * Placebo User: A Special Kind Of Impotent User That Cant Perform Actions That Might
                        Change The State Of The App But Can See All.
                    </div>
                </div>
                <div>
                    <div className="placebo-user-sec">
                        <h2 className="placebo-user-title">Admin</h2>
                        <div className="placebo-user-loginfo row row-fix">
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Username</div>
                                <div className="placebo-user-fieldtext">fakeadmin1</div>
                            </div>
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Password</div>
                                <div className="placebo-user-fieldtext">fakeadmin1</div>
                            </div>

                        </div>

                    </div>
                    <div className="placebo-user-sec">
                        <h2 className="placebo-user-title">Airline</h2>
                        <div className="placebo-user-loginfo row row-fix">
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Username</div>
                                <div className="placebo-user-fieldtext">fakeairline1</div>
                            </div>
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Password</div>
                                <div className="placebo-user-fieldtext">fakeairline1</div>
                            </div>

                        </div>
                    </div>
                    <div className="placebo-user-sec">
                        <h2 className="placebo-user-title">Customer</h2>
                        <div className="placebo-user-loginfo row row-fix">
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Username</div>
                                <div className="placebo-user-fieldtext">fakecustomer1</div>
                            </div>
                            <div className="col-md-6 col-sm-12 col-12 col-fix placebo-user-field">
                                <div className="placebo-user-fieldcap">Password</div>
                                <div className="placebo-user-fieldtext">fakecustomer1</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ReadMeComponent;