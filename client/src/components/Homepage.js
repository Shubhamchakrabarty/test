import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Homepage.css';
import landingPageHeroRight from '../assets/landing_page_hero_right.png';
import landingPagePatternRight from '../assets/landing_page_pattern_right.png';
import landingPagePatternTopLeft from '../assets/landing_page_pattern_top_left.png';
import Modal from './Modal'; // Modal component for Contact Us
import Footer from './Footer';

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleClientLoginClick = () => {
    navigate('/client-login');
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="left">
          <Link to="/" className="logo poppins-regular">
            <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
          </Link>
        </div>
      </header>

      <div className="main-content">
        <div className="hero-section">
          <div className="text-content poppins-semibold">
            <h1>Hire 10x Faster</h1>
            <p>Pehchaan's AI Interviewer will turbo-charge your recruitment process.</p>
            <button className="primary poppins-medium" onClick={toggleModal}>Contact Us</button>
          </div>
          <div className="image-container">
            <div className="image-content">
              <img src={landingPageHeroRight} alt="Main Hero" className="main-image" />
              <img src={landingPagePatternRight} alt="Pattern Right" className="pattern-right" />
            </div>
          </div>
          <div className="login-section">
            {/* Candidate Card */}
            <div className="login-card candidate poppins-medium">
              <h3>For Job Seekers</h3>
              <p>Find your dream job, prepare for interviews, and showcase your skills.</p>
              <div className="job-seekers-buttons">
                <button className="secondary poppins-medium" onClick={handleLoginClick}>Candidate Log In</button>
                <button className="secondary poppins-medium" onClick={handleSignupClick}>Create Account</button>
              </div>

            </div>


            {/* Recruiter Card */}
            <div className="login-card recruiter poppins-medium">
              <h3>For Recruiters</h3>
              <p>Post job openings, assess candidates and close your hiring 10x faster.</p>
              <button className="secondary poppins-medium" onClick={handleClientLoginClick}>Recruiter Log In</button>
            </div>


          </div>
        </div>


        {/* Coming Soon section */}
        <div className="coming-soon-section poppins-medium">
          <h2>Coming Soon for Job Seekers</h2>
          <div className="coming-soon-cards">
            <div className="coming-soon-card">
              <h3>Interview Prep</h3>
              <p>Prepare for Interviews with your AI mentor.</p>
            </div>
            <div className="coming-soon-card">
              <h3>Showcase Yourself</h3>
              <p>Create a professional profile to showcase your skills.</p>
            </div>
            <div className="coming-soon-card">
              <h3>Knowledge Factory</h3>
              <p>Learn from an AI Coach to boost your career.</p>
            </div>
          </div>
        </div>
        {/* <div> */}
        <Footer />
        {/* </div> */}
        {/* Modal for Contact Us */}
        {modalOpen && (
          <Modal
            toggleModal={toggleModal}
            headerText="Contact Us"
            bodyText="Please reach out to us at: kunal@pehchaan.me"
            buttonText="Close"
          />
        )}
      </div>
    </div>

  );
};

export default Homepage;
