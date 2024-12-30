import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { extraCurricularsFormJson } from '../surveyForms/extraCurricularsForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css'; // Reusing SignUp.css for consistent styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const ExtraCurricularsForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(extraCurricularsFormJson));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.error('User is not set');
      alert('User is not set. Please log in again.');
      navigate('/login');
      return;
    }

    const survey = surveyModel;
    survey.applyTheme(theme);

    survey.onComplete.add(async(sender) => {
      setLoading(true);
      setMessage('');

      const results = sender.data;
      const extracurriculars = results.activities.map(activity => ({
        extracurricular_id: activity.extracurricular,
        category_id: activity.category,
        achievement: activity.achievement,
      }));

      const data = {
        user_id: user.id,
        extracurriculars
      };

      // Send the data to the backend
      try {
        const response = await fetch(getApiUrl('/api/extracurriculars/addUserExtracurriculars'), {
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
        setMessage('Extracurricular activities added successfully!');
        navigate('/optional-sections'); // Change to the next form route
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
      <h2>ADD YOUR EXTRA CURRICULAR ACTIVITIES</h2>
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

export default ExtraCurricularsForm;