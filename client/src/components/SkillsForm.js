// components/SkillsForm.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { skillsFormJson } from '../surveyForms/skillsForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const SkillsForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(skillsFormJson));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.error('User is not set');
      alert('User is not set. Please log in again.');
      navigate('/login'); // Navigate to login page if user is not set
      return;
    }

    const survey = surveyModel;
    survey.applyTheme(theme);

    survey.onComplete.add(async (sender) => {
      setLoading(true);
      setMessage('');

      const results = sender.data;

      console.log('Results received:', results);
      /*
      const skills = results.skillsPanel.map(skill => ({
        skill_id: skill.skill,
        rating: skill.rating
      }));
      */

      const skills = results.skills.filter(skill => skill.skill && skill.rating).map(skill => ({
        skill_id: skill.skill,
        rating: skill.rating,
      }));

      console.log('Skills array:', skills);
      const data = {
        user_id: user.id,
        skills
      };

      console.log('Entries to be sent to backend:', data);

      if (skills.length === 0) {
        setMessage('Please add at least one skill.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl('/api/addUserSkills'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Server Response:', responseData);
        setMessage('Skills added successfully!');
        navigate('/optional-sections');
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    setSurveyModel(survey);
  }, [surveyModel, user, theme, navigate]);

  return (
    <div className="signup-container">
      <header className="signup-navbar">
        <div className="left">
          <Link to="/" className="logo">
            <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
          </Link>
        </div>
      </header>
      <div className="circle-large">
        <img src={signupCircleLarge} alt="Large Circle" />
      </div>
      <div className="circle-small">
        <img src={signupCircleSmall} alt="Small Circle" />
      </div>
      <div className="signup-main-content">
        <h2>ADD YOUR SKILLS</h2>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your skills...</div>
        </div>
      ) : (
        <Survey model={surveyModel} />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SkillsForm;