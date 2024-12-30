import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './LandingPage.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';
import { getApiUrl } from '../utils/apiUtils';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [profileScoring, setProfileScoring] = useState(false);
  const [interviewScoring, setInterviewScoring] = useState(false);
  const [scoresAvailable, setScoresAvailable] = useState(false);
  const [profileScoreAvailable, setProfileScoreAvailable] = useState(false);
  const [interviewScoreAvailable, setInterviewScoreAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkCvUpload = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/check-cv/${user.id}`));
      const data = await response.json();
      if (response.ok) {
        setCvUploaded(data.uploaded);
      } else {
        console.error('Failed to check CV upload:', data.message);
      }
    } catch (error) {
      console.error('Error checking CV upload:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const checkInterviewCompletion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/interviews/check-completion/${user.email}`));
      const data = await response.json();
      if (response.ok && data.completed) {
        setInterviewCompleted(true);
      } else if (data.message === 'No interview response found for the user') {
        setInterviewCompleted(false);
      } else {
        console.error('Failed to check interview completion:', data.message);
      }
    } catch (error) {
      console.error('Error checking interview completion:', error);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  const checkProfileScore = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/scores/latest/${user.id}`));
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Profile score data:', data);
        if (data && data.final_score) {
          setProfileScoreAvailable(true);
        } else {
          setProfileScoreAvailable(false);
        }
      } else {
        setProfileScoreAvailable(false);
      }
    } catch (error) {
      console.error('Error checking profile score:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const checkInterviewScore = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/scores/latest-interview/${user.id}`));
      if (response.ok) {
        setInterviewScoreAvailable(true);
      } else {
        setInterviewScoreAvailable(false);
      }
    } catch (error) {
      console.error('Error checking interview score:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const initiateProfileScoring = useCallback(async () => {
    setProfileScoring(true);
    try {
      await fetch(getApiUrl(`/api/scores/score-profile`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (error) {
      console.error('Error initiating profile scoring:', error);
    } finally {
      setProfileScoring(false);
    }
  }, [user.id]);

  const initiateInterviewScoring = useCallback(async () => {
    setInterviewScoring(true);
    try {
      await fetch(getApiUrl(`/api/scores/score-interview`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (error) {
      console.error('Error initiating interview scoring:', error);
    } finally {
      setInterviewScoring(false);
    }
  }, [user.id]);

  useEffect(() => {
    checkCvUpload();
    checkInterviewCompletion();
    checkProfileScore();
    checkInterviewScore();
  }, [checkCvUpload, checkInterviewCompletion, checkProfileScore, checkInterviewScore]);

  useEffect(() => {
    console.log('Checking if profile scoring should be initiated...');
    console.log('cvUploaded:', cvUploaded);
    console.log('profileScoreAvailable:', profileScoreAvailable);
    if (cvUploaded && !profileScoreAvailable) {
      console.log('Initiating profile scoring...');
      //initiateProfileScoring();
    }
    if (interviewCompleted && !interviewScoreAvailable) {
      console.log('Initiating interview scoring...');
      initiateInterviewScoring();
    }
  }, [cvUploaded, profileScoreAvailable, interviewCompleted, interviewScoreAvailable, initiateProfileScoring, initiateInterviewScoring]);

  useEffect(() => {
    console.log('Checking if all scores are available...');
    console.log('profileScoreAvailable:', profileScoreAvailable);
    console.log('interviewScoreAvailable:', interviewScoreAvailable);
    setScoresAvailable(profileScoreAvailable && interviewScoreAvailable);
  }, [profileScoreAvailable, interviewScoreAvailable]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const getMessage = () => {
    if (!cvUploaded) {
      return 'Please upload your CV to proceed.';
    } else if (cvUploaded && !interviewCompleted) {
      return 'Your CV is uploaded. Please proceed to the video interview.';
    } else if (cvUploaded && interviewCompleted && !profileScoreAvailable && !interviewScoreAvailable) {
      return 'Your interview is completed. We are assessing your responses. Please check back in 30 minutes.';
    } else if (cvUploaded && profileScoreAvailable && interviewScoreAvailable) {
      return 'Your profile and interview assessments are complete. You can now access your profile dashboard.';
    }
    return '';
  };

  const handleVideoAssessmentClick = () => {
    if (cvUploaded) {
      navigate('/jobs');
    } else {
      alert('Please upload your CV before proceeding to the video assessment.');
    }
  };

  const handleEditProfileClick = () => {
    if (cvUploaded) {
      navigate('/profile');
    } else {
      alert('Please upload your CV before proceeding to the edit profile.');
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
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
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Updating your details...</div>
        </div>
      ) : (
      <div className="landing-main-content">
        <h1>Welcome to Pehchaan, {user.firstName}</h1>
        {cvUploaded && (
          <p className="assessment-message">{getMessage()}</p>
        )}
        <div className="card-container">
          <div className="card" onClick={() => navigate('/cv-upload-form')}>
            <h2>Upload CV</h2>
          </div>
          <div
            className={`card ${cvUploaded ? (interviewCompleted ? '' : 'highlight-card') : ''}`}
            onClick={handleVideoAssessmentClick}
          >
            <h2>Apply to Jobs</h2>
          </div>
            {cvUploaded && (
              <div className="card" onClick={handleEditProfileClick}>
                <h2>Update your profile</h2>
              </div>
            )}
            {cvUploaded && interviewCompleted && scoresAvailable && (
              <div
                className={`card highlight-card`}
                onClick={handleDashboardClick}
              >
                <h2>Profile Dashboard</h2>
              </div>
            )}
        </div>
      </div>
      )}
    </div>
  );
};

export default LandingPage;

