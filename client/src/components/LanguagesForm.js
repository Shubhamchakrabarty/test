import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { languagesFormJson } from '../surveyForms/languagesForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const LanguagesForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(languagesFormJson));
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

      const languages = results.languages.filter(language => language.language && language.language_proficiency_user).map(language => ({
        language_id: language.language,
        language_proficiency_user: language.language_proficiency_user,
      }));

      console.log('Languages array:', languages);
      const data = {
        user_id: user.id,
        languages
      };

      console.log('Entries to be sent to backend:', data);

      if (languages.length === 0) {
        setMessage('Please add at least one language.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl('/api/languages/add'), {
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
        setMessage('Languages added successfully!');
        navigate('/optional-sections'); // Uncomment to navigate to the next form
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
        <h2>ADD YOUR LANGUAGES</h2>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your languages...</div>
        </div>
      ) : (
        <Survey model={surveyModel} />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LanguagesForm;