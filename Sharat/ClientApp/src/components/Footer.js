import React, { useState } from 'react';
import { connect } from 'react-redux';

const Footer = (props) => {
    const [LogStateChangeAlways, SetLogStateChangeAlways] = useState(false);
    return (
        <footer className="footer-component">
            <div className="footer-flex">
                <div>
                    <div className="contact-component">
                        <p className="mb-2">
                            <i className="fa-thin fa-envelope"></i>
                            contact@tocano.com
                        </p>
                        <p className="mb-0">
                            <i className="fa-light fa-location-dot"></i> 123 Street, New YorK, USA
                        </p>
                    </div>

                </div>
                <div>
                    {LogStateChangeAlways ? console.log(props.storeState) : null}
                    <ul>
                        <li  >FAQs </li>
                        <li><a
                        >License</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}



const mapStateToProps = (state) => ({
    storeState: state
});
export default connect(mapStateToProps)(Footer);