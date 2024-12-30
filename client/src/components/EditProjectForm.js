import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { editProjectFormJson } from '../surveyForms/editProjectForm';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../utils/apiUtils';
import 'survey-core/defaultV2.min.css';
import './SignUp.css';
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const EditProjectForm = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [surveyModel, setSurveyModel] = useState(new Model(editProjectFormJson));
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

    const fetchProjectEntry = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/projects/${id}`));
        const data = await response.json();
        console.log('Fetched Project Entry:', data);
        const survey = surveyModel;
        survey.data = {
          project_level_id: data.project_level_id,
          project_name: data.project_name,
          start_date: data.start_date ? data.start_date.split('T')[0] : '',
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          project_summary: data.project_summary
        };
        setSurveyModel(survey);
      } catch (error) {
        console.error('Error fetching project entry:', error);
      }
    };

    fetchProjectEntry();

    const survey = surveyModel;
    survey.applyTheme(theme);

    survey.onComplete.add(async (sender) => {
      setLoading(true);
      setMessage('');
      const results = sender.data;

      const entry = {
        user_id: user.id,
        project_level_id: results.project_level_id,
        project_name: results.project_name,
        start_date: new Date(results.start_date).toISOString().split('T')[0],
        end_date: new Date(results.end_date).toISOString().split('T')[0],
        project_summary: results.project_summary
      };

      try {
        const response = await fetch(getApiUrl(`/api/projects/${id}`), {
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
        setMessage('Project details updated successfully!');
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

      if (questionName === 'project_level_id') {
        endpoint = getApiUrl(`/api/projects/levels?filter=${searchText}&skip=${skip}&take=${take}`);
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
        <h2>EDIT YOUR PROJECT DETAILS</h2>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your project details...</div>
        </div>
      ) : (
        <Survey model={surveyModel} />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProjectForm;