import React from "react";
import './Footer.css';
import fb from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'

const Footer = () => {
    return (
        <div className='footer'>
            <div className="footer-inner-container">
                {/* <div className="footer-links-list">
                    <div className="footer-links">
                        <h4>Services</h4>
                        <a href="#">
                            <p>For Organization</p>
                        </a>
                        <a href="#">
                            <p>For Recruiter</p>
                        </a>
                    </div>
                    <div className="footer-links">
                        <h4>Resources</h4>
                        <a href="#">
                            <p>Resources Center</p>
                        </a>
                        <a href="#">
                            <p>Testimonials</p>
                        </a>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <a href="#">
                            <p>About</p>
                        </a>
                        <a href="#">
                            <p>Press</p>
                        </a>
                        <a href="#">
                            <p>Career</p>
                        </a>
                        <a href="#">
                            <p>Contact</p>
                        </a>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <a href="#">
                            <p>Customer support</p>
                        </a>
                        <a href="#">
                            <p>Learn Pehchaan</p>
                        </a>
                        <a href="#">
                            <p>Developer resources</p>
                        </a>
                    </div>
                    <div className="footer-links">

                        <h4>Connect with us</h4>
                        <div className="socialmedia">
                            <p><img src={fb} alt='' /></p>
                            <p><img src={linkedin} alt='' /></p>
                            <p><img src={instagram} alt='' /></p>
                        </div>
                    </div>
                </div> */}
                <hr></hr>

                <div className="footer-below">
                    <div className="footer-copyright">
                        <p>© {new Date().getFullYear()} Cryptalent Technologies Private Ltd. All rights reserved</p>
                    </div>
                    <div className="footer-below-links">
                        {/* <a href="#">
                            <div>
                                <p>Term & Conditions</p>
                            </div>
                        </a> */}

                        <p>
                            Registered Address: House No. 838, Ist Floor, Sector - 47, Gurgaon, Haryana
                        </p>

                        {/* <a href="#">
                            <div>
                                <p>Privacy</p>
                            </div>
                        </a>
                        <a href="#">
                            <div>
                                <p>Security</p>
                            </div>
                        </a> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
