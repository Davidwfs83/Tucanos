import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginAction, ResetError } from '../../redux/Auth/auth.actions';
import { AnonymousNavigation } from '../../services/NavigationConstants';

const UserComponent = (props) => {

    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Allow Clicking Inside of Dropdown Without Closing it
    useEffect(() => {
        window.$('.dropdown-menu').on("click.bs.dropdown", function (e) {
            if (e.target.id !== 'regbtn') {
                e.stopPropagation();
            }
        });
    }, []);

    useEffect(() => {
        $(document).ready(() => {
            window.$('.user-component').on("hidden.bs.dropdown", function (e) {

                /*$(document).removeAttribute("onkeypress");*/
                dispatch(ResetError());
            }
            );
            //window.$('.user-component').on("shown.bs.dropdown", function (e) {
            //    
            //    $(document).keypress(function (e) {
            //        if (e.which == 13) {
            //            window.$("#loginbtn").click();
            //        }
            //    });
            //}
            //);

        });

    }, []);




    const onLogin = (e) => {
        e.preventDefault();
        loginAction(username, password, props.history)(dispatch);
    }
    return (
        <div className="user-component">
            <div className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa-solid fa-grip-dots"></i>
            </div>
            <div className="dropdown-menu dropdown-menu-right" >
                <div className="login-component">
                    {
                        props.loginErr.Active ?
                            (
                                <div style={{
                                    margin: "5px auto 15px auto",
                                    fontSize: "12px",
                                    border: "1px solid transparent",
                                    padding: "10px",
                                    borderRadius: "0.25rem",
                                    backgroundColor: "#f8d7da",
                                    borderColor: "#f5c6cb"
                                }}>
                                    {props.loginErr.ErrMsg}
                                </div>
                            ) : null
                    }
                    <h5 className="mb-3">Login to your account</h5>
                    <form onSubmit={onLogin}>
                        <div className="field">
                            <div className="field-cap">Username</div>
                            <div className="field-wrap">
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="field-cap">Password </div>
                            <div className="field-wrap">
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="input" />
                            </div>
                        </div>

                        <div className="field">
                            <button type='submit' id='loginbtn' className="button button-brand w-100">Log In</button>
                        </div>

                    </form>
                    {/*<Link to={AnonymousNavigation.RegisterPage.Url} className="button button-brand w-100">*/}

                    {/*    Register*/}
                    {/*</Link>*/}
                    <button className="button button-brand w-100" id='regbtn' onClick={() => {
                        console.log(props);
                        props.history.push(AnonymousNavigation.RegisterPage.Url);
                    }}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth }) => ({
    loginErr: auth.Error
});

export default withRouter(connect(mapStateToProps)(UserComponent));