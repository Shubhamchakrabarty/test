import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { internshipFormJson } from '../surveyForms/internshipForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils'; // Import the utility function
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const InternshipForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  const [surveyModel, setSurveyModel] = useState(new Model(internshipFormJson));
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

    survey.onComplete.add(async(sender) => {
      setLoading(true);
      setMessage('');

      const results = sender.data;
      const entries = [];

      for (let i = 1; i <= 10; i++) {
        if (results[`designation${i}`]) {
          entries.push({
            user_id: user.id,
            designation_id: results[`designation${i}`],
            company_id: results[`company${i}`],
            is_current: i === 1 ? results[`isCurrent1`] : false, // Only set for the first page
            start_date: new Date(results[`startDate${i}`]).toISOString().split('T')[0],
            end_date: i === 1 && results[`isCurrent1`] ? null : new Date(results[`endDate${i}`]).toISOString().split('T')[0],
            experience_summary: results[`experienceSummary${i}`]
          });
        }
      }

      // Log entries
      console.log('Entries to be sent to backend:', entries);

      // Send the data to the backend
      try {
        const responses = await Promise.all(entries.map(async entry => {
          console.log('Sending request for entry:', entry);
          const response = await fetch(getApiUrl('/api/addInternship'), {
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
        setMessage('Internship details saved successfully!');
        navigate('/skills-form');
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
      

      if (questionName.includes('designation')) {
        endpoint = getApiUrl(`/api/internship-designations?filter=${searchText}&skip=${skip}&take=${take}`);
      } else if (questionName.includes('company')) {
        endpoint = getApiUrl(`/api/companies?filter=${searchText}&skip=${skip}&take=${take}`);
      }

      fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
          const uniqueItems = Array.from(new Set(data.map(item => item.name)))
            .map(name => data.find(item => item.name === name));
          const items = uniqueItems.map(item => ({
            value: item.id,
            text: item.name
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
        <h2>ADD YOUR INTERNSHIP DETAILS</h2>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your internship details...</div>
        </div>
      ) : (
        <Survey model={surveyModel} />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default InternshipForm;