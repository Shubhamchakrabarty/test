import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import './SignUp.css'; // Reusing SignUp.css for consistent styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';
import avatarImage from '../assets/avatar_image.png';

const ReferencesForm = () => {
    const { user } = useContext(UserContext);
    const [referenceFrom, setReferenceFrom] = useState('');
    const [referenceContact, setReferenceContact] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user) {
        alert('User is not set. Please log in again.');
        navigate('/login');
        return;
      }
  
      setLoading(true);
      setMessage('');
  
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('reference_from', referenceFrom);
      formData.append('reference_contact', referenceContact);
      if (file) {
        formData.append('file', file);
      }
  
      try {
        const response = await fetch(getApiUrl('/api/references/add'), {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        console.log('Server Response:', responseData);
        setMessage('Reference added successfully!');
        // Clear the form for the next entry
        setReferenceFrom('');
        setReferenceContact('');
        setFile(null);
  
        // Navigate to optional sections after successful submission
        navigate('/optional-sections');
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  

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
        <h2>ADD YOUR REFERENCES</h2>
        <div className="greeting-container">
          <img src={avatarImage} alt="Person" className="greeting-image" />
          <div className="greeting-bubble">Please provide details for your references.</div>
        </div>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Saving your reference...</div>
        </div>
      ) : (
        // Added className "references-form" to form element
        <form onSubmit={handleSubmit} className="references-form">
          <div className="form-group">
            <label htmlFor="referenceFrom">Reference From:</label>
            <input
              type="text"
              id="referenceFrom"
              value={referenceFrom}
              onChange={(e) => setReferenceFrom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="referenceContact">Reference Contact:</label>
            <input
              type="text"
              id="referenceContact"
              value={referenceContact}
              onChange={(e) => setReferenceContact(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Upload Reference Letter:</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="btn">Add Reference</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ReferencesForm;