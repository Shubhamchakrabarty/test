import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { editInternshipFormJson } from '../surveyForms/editInternshipForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const EditInternshipForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(editInternshipFormJson));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      console.error('User is not set');
      alert('User is not set. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchInternshipEntry = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/internship/${id}`));
        const data = await response.json();
        console.log('Fetched Internship Entry:', data);
        const survey = surveyModel;
        survey.data = {
          company: data.company_id,
          designation: data.designation_id,
          isCurrent: data.is_current,
          startDate: data.start_date.split('T')[0],
          endDate: data.end_date ? data.end_date.split('T')[0] : '',
          experienceSummary: data.experience_summary
        };
        setSurveyModel(survey);
      } catch (error) {
        console.error('Error fetching internship entry:', error);
      }
    };

    fetchInternshipEntry();

    const survey = surveyModel;
    survey.applyTheme(theme);

    survey.onComplete.add(async(sender) => {
      setLoading(true);
      setMessage('');
      const results = sender.data;

      const entry = {
        user_id: user.id,
        company_id: results.company,
        designation_id: results.designation,
        is_current: results.isCurrent,
        start_date: new Date(results.startDate).toISOString().split('T')[0],
        end_date: results.isCurrent ? null : new Date(results.endDate).toISOString().split('T')[0],
        experience_summary: results.experienceSummary
      };

      try {
        const response = await fetch(getApiUrl(`/api/internship/${id}`), {
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
        setMessage('Internship details updated successfully!');
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

      if (questionName === 'company') {
        endpoint = getApiUrl(`/api/companies?filter=${searchText}&skip=${skip}&take=${take}`);
      } else if (questionName === 'designation') {
        endpoint = getApiUrl(`/api/internship-designations?filter=${searchText}&skip=${skip}&take=${take}`);
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
        <h2>EDIT YOUR INTERNSHIP DETAILS</h2>
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

export default EditInternshipForm;