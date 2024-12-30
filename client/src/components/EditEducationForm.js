// components/EditEducationForm.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { editEducationFormJson } from '../surveyForms/editEducationForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const EditEducationForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(editEducationFormJson));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get the education entry ID from the URL params

  useEffect(() => {
    if (!user) {
      console.error('User is not set');
      alert('User is not set. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchEducationEntry = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/education/entry/${id}`));
        const data = await response.json();
        console.log('Fetched Education Entry:', data);

        
        // Pre-populate the form fields with the fetched data
        const survey = surveyModel;
        survey.data = {
            university: data.university_id,
            degree: data.degree_id,
            major: data.major,
            cgpa: data.cgpa,
            startDate: data.start_date.split('T')[0],
            endDate: data.end_date.split('T')[0]
        };
        setSurveyModel(survey);
      } catch (error) {
        console.error('Error fetching education entry:', error);
      }
    };

    fetchEducationEntry();

    const survey = surveyModel;
    survey.applyTheme(theme);

    survey.onComplete.add(async(sender) => {
      setLoading(true);
      setMessage('');
      const results = sender.data;
      console.log('Results received:', results);

    

      const entry = {
        user_id: user.id,
        university_id: results.university,
        degree_id: results.degree,
        major: results.major,
        cgpa: results.cgpa,
        start_date: new Date(results.startDate).toISOString().split('T')[0],
        end_date: new Date(results.endDate).toISOString().split('T')[0]
      };

      try {
        const response = await fetch(getApiUrl(`/api/education/${id}`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Server Response:', responseData);
        setMessage('Education details updated successfully!');
        navigate('/profile');
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    });

    survey.onChoicesLazyLoad.add((sender, options) => {
        const questionName = options.question.name;
        const searchText = options.filter || '';
        const skip = options.skip || 0;
        const take = options.take || 40;
        let endpoint = '';
  
        if (questionName === 'university') {
          endpoint = getApiUrl(`/api/universities?filter=${searchText}&skip=${skip}&take=${take}`);
        } else if (questionName === 'degree') {
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
  }, [surveyModel, user, theme, navigate, id]);

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
        <h2>EDIT EDUCATION DETAILS</h2>
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

export default EditEducationForm;