import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { customSectionsFormJson } from '../surveyForms/customSectionsForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const CustomSectionsForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(customSectionsFormJson));
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

      const customSections = Object.keys(results)
        .filter(key => key.startsWith('section_title') && results[key])
        .map((key, index) => ({
          section_title: results[key],
          details: results[`details${index + 1}`],
        }));

      console.log('Custom Sections array:', customSections);
      const data = {
        user_id: user.id,
        customSections
      };

      console.log('Entries to be sent to backend:', data);

      if (customSections.length === 0) {
        setMessage('Please add at least one custom section.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(getApiUrl('/api/customsections/add'), {
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
        setMessage('Custom sections added successfully!');
        // navigate to the next form route
        navigate('/optional-sections');
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    survey.onAfterRenderQuestion.add((survey, options) => {
      if (options.question.name.startsWith('addMoreButton')) {
        const questionIndex = parseInt(options.question.name.replace('addMoreButton', ''));
        document.getElementById(`addMoreButton${questionIndex}`).onclick = () => {
          survey.setValue('triggerNextPage', questionIndex);
        };
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
        <h2>ADD YOUR CUSTOM SECTIONS</h2>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your custom sections...</div>
        </div>
      ) : (
        <Survey model={surveyModel} />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CustomSectionsForm;