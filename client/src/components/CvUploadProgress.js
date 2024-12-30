import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Reusing SignUp.css for consistent styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const CvUploadProgress = () => {
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const progressMessages = [
      'Uploading CV...',
      'Saving Education Data...',
      'Saving Work Experience...',
      'Saving Projects...',
      'Loading Profile...'
    ];

    let currentIndex = 0;

    const updateProgress = () => {
      if (currentIndex < progressMessages.length) {
        console.log(`Updating progress: ${progressMessages[currentIndex]}`);
        setProgress(progressMessages[currentIndex]);
        currentIndex++;
        setTimeout(updateProgress, 6000); // Update every 5 seconds
      } else {
        console.log('Navigating to profile page');
        // Navigate to the profile page after the final progress message
        navigate('/user-home');
      }
    };

    updateProgress(); // Start the progress updates

    // Cleanup function
    return () => {
      console.log("useEffect cleanup");
    };
  }, [navigate]);

  return (
    <div className="signup-container">
      <header className="signup-navbar">
        <div className="left">
          <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
        </div>
      </header>
      <div className="circle-large">
        <img src={signupCircleLarge} alt="Large Circle" />
      </div>
      <div className="circle-small">
        <img src={signupCircleSmall} alt="Small Circle" />
      </div>
      <div className="signup-main-content">
        <h2>CV UPLOAD PROGRESS</h2>
        <div className="greeting-container">
          <div className="greeting-bubble">Processing your CV. Please wait...</div>
        </div>
      </div>
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loader-message">{progress}</div>
      </div>
    </div>
  );
};

export default CvUploadProgress;