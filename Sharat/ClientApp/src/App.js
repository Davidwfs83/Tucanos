import React from 'react';
import {  Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkAutoLogin } from './services/AuthService';
import Header from './components/header/Header';
import DashboardNavigator from './components/DashboardBase/Navigation/DashboardNavigator';
import Footer from './components/Footer';
import UserSelectRouter from './Pages/UserSelectRouter';
import CenterPopUpsRouter from './Pages/CenterPopUps/CenterPopUpsRouter';
import { DashboardNavigation } from './services/NavigationConstants';
import ErrBoundary from './components/ErrBoundary';

class App extends React.Component {

    componentDidMount() {
        this.props.checkToken(this.props.history);
    }
    render() {
        return (
            <div>
                <ErrBoundary>
                    <div className='page'>
                        <Header isAuthenticated={!(this.props.user.userType === "")} />
                        {
                            this.props.user ?
                                <Route path={DashboardNavigation.RootUrl} render={() => <DashboardNavigator user={this.props.user} />} />
                                : null
                        }
                        <section className="main-component">
                            <div className="dashboard-content">
                                < UserSelectRouter />
                            </div>
                            <Footer />
                        </section>
                    </div>
                    <CenterPopUpsRouter />
                </ErrBoundary>
            </div>

        );
    }
}


const mapStateToProps = ({ auth }) => ({
    user: auth.currentUser
});

const mapDispatchToProps = dispatch => ({
    checkToken: history => checkAutoLogin(dispatch, history)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

