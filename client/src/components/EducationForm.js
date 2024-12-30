// components/EducationForm.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { educationFormJson } from '../surveyForms/educationForm';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css'; // Import the SurveyJS theme
import './SignUp.css'; // Reusing SignUp.css for consistent styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const EducationForm = () => {
  const { user } = useContext(UserContext); // Use user from UserContext
  const { theme } = useContext(ThemeContext); // Use theme from ThemeContext
  const [surveyModel, setSurveyModel] = useState(new Model(educationFormJson));
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
      const entries = [];

      for (let i = 1; i <= 10; i++) {
        if (results[`university${i}`]) {
          entries.push({
            user_id: user.id,
            university_id: results[`university${i}`],
            degree_id: results[`degree${i}`],
            major: results[`major${i}`],
            cgpa: results[`cgpa${i}`],
            start_date: new Date(results[`startDate${i}`]).toISOString().split('T')[0],  // Format date as yyyy-mm-dd
            end_date: new Date(results[`endDate${i}`]).toISOString().split('T')[0]     // Format date as yyyy-mm-dd
          });
        }
      }

      // Send the data to the backend
      try {
        const responses = await Promise.all(entries.map(async entry => {
          console.log('Sending request for entry:', entry);
          const response = await fetch(getApiUrl('/api/addEducation'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        }));

        console.log('Server Response:', responses);
        setMessage('Education details saved successfully!');
        navigate('/jobs-form');
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

    survey.onChoicesLazyLoad.add((sender, options) => {
      const questionName = options.question.name;
      const searchText = options.filter || '';
      const skip = options.skip || 0;
      const take = options.take || 40;
      let endpoint = '';

      if (questionName.includes('university')) {
        endpoint = getApiUrl(`/api/universities?filter=${searchText}&skip=${skip}&take=${take}`);
      } else if (questionName.includes('degree')) {
        endpoint = getApiUrl(`/api/degrees?filter=${searchText}&skip=${skip}&take=${take}`);
      }

      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            const uniqueItems = Array.from(new Set(data.map(item => item.name || item.course)))
            .map(name => {
              return data.find(item => (item.name || item.course) === name);
            });
            const items = uniqueItems.map(item => ({
                value: item.id,
                text: item.name || item.course  // Use item.course for degrees
              }));
              options.setItems(items, data.length < take);
        })
        .catch((error) => {
          console.error('Error loading choices:', error);
          options.setItems([], true);
        });
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
        <h2>EDUCATION DETAILS</h2>
      </div>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <div className="loader-message">Submitting your details...</div>
          </div>
        ) : (
          <Survey model={surveyModel} />
        )}
        {message && <p>{message}</p>}
      </div>
  );
};

export default EducationForm;