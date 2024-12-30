import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import avatarImage from '../assets/avatar_image.png';
import { getApiUrl } from '../utils/apiUtils';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    experienceLevel: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    experienceLevel: ''
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10}$/;
    return re.test(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Reset errors for phoneNumber and email as the user types
    if (name === 'phoneNumber') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: validatePhoneNumber(value) ? '' : 'Invalid phone number. It should be 10 digits.'
      }));
    }

    if (name === 'email') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value) ? '' : 'Invalid email address.'
      }));
    }
  };

  const handleExperienceSelect = (level) => {
    setFormData((prevData) => ({
      ...prevData,
      experienceLevel: level
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    fetch(getApiUrl('/auth/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigate('/verify-otp', {
            state: {
              email: formData.email,
              firstName: formData.firstName,
              phoneNumber: formData.phoneNumber,
              smsSent: data.smsSent,
              emailSent: data.emailSent
            }
          });
        } else {
          setMessage(data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage('An error occurred while signing up. Please try again.');
      });
  };

  // Page-specific validations
  const isPage1Valid = () => {
    return formData.firstName && formData.lastName;
  };

  const isPage2Valid = () => {
    return (
      formData.phoneNumber &&
      validatePhoneNumber(formData.phoneNumber) &&
      formData.email &&
      validateEmail(formData.email) &&
      formData.city &&
      formData.state
    );
  };

  const isPage3Valid = () => {
    return formData.experienceLevel;
  };

  // Navigation through pages
  const nextPage = () => {
    if (currentPage === 1 && !isPage1Valid()) {
      setErrors({
        firstName: formData.firstName ? '' : 'First Name is required.',
        lastName: formData.lastName ? '' : 'Last Name is required.',
      });
    } else if (currentPage === 2 && !isPage2Valid()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: formData.phoneNumber ? errors.phoneNumber : 'Phone number is required.',
        email: formData.email ? errors.email : 'Email is required.',
        city: formData.city ? '' : 'City is required.',
        state: formData.state ? '' : 'State is required.',
      }));
    } else {
      setErrors({});
      setCurrentPage(currentPage + 1);
    }
  };


  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="signup-container">
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Creating your account...</div>
        </div>
      ) : (
        <div className="signup-main-content">
          <header className="signup-navbar">
            <div className="signup-left">
              <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
              </Link>
            </div>
          </header>
          <h2 className='poppins-regular signup-heading'>START YOUR JOURNEY</h2>
          <form onSubmit={handleSubmit}>
            {currentPage === 1 && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.firstName ? 'filled' : ''}>First Name *</label>
                  {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.lastName ? 'filled' : ''}>Last Name *</label>
                  {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                </div>

                <button type="button" className={`next-button ${!isPage1Valid() ? 'disabled' : ''}`} onClick={nextPage} disabled={!isPage1Valid()}>
                  Next
                </button>
              </>
            )}

            {currentPage === 2 && (
              <>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.phoneNumber ? 'filled' : ''}>Phone Number *</label>
                  {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.email ? 'filled' : ''}>Email *</label>
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.city ? 'filled' : ''}>City *</label>
                  {errors.city && <p className="error-text">{errors.city}</p>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <label className={formData.state ? 'filled' : ''}>State *</label>
                  {errors.state && <p className="error-text">{errors.state}</p>}
                </div>

                <button type="button" className="back-button" onClick={previousPage}>Back</button>
                <button type="button" className={`next-button ${!isPage2Valid() ? 'disabled' : ''}`} onClick={nextPage} disabled={!isPage2Valid()}>
                  Next
                </button>
              </>
            )}

            {currentPage === 3 && (
              <>
                <label className="experience-label">Experience Level *</label>
                <div className="form-group">
                  <div className="experience-options">
                    {["Student", "Graduate", "Post Graduate", "Intern", "Entry Level Job", "Senior Level Job"].map(level => (
                      <div
                        key={level}
                        className={`experience-option ${formData.experienceLevel === level ? 'selected' : ''}`}
                        onClick={() => handleExperienceSelect(level)}
                        required
                      >
                        <img src={`./assets/${level.toLowerCase().replace(/ /g, '_')}_icon.png?v=${new Date().getTime()}`} alt={level} />
                        <span>{level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="button" className="back-button" onClick={previousPage}>Back</button>
                <button type="submit" className={`submit-button ${!isPage3Valid() ? 'disabled' : ''}`} disabled={!isPage3Valid()}>
                  Sign Up
                </button>
              </>
            )}
          </form>
          {message && <p className="error-text">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default SignUp;
