import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import './InviteUserJob.css';
import { getApiUrl } from '../utils/apiUtils';
import Modal from './Modal';
import avatarImage from '../assets/avatar_image.png';

function InviteUserJob() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    experienceLevel: 'Entry Level Job'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [userJobExists, setUserJobExists] = useState(false);
  const [userJobStatus, setUserJobStatus] = useState('Pending');
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
  const { jobId } = useParams();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/auth/create-user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {                    // if the user is created successfully
        setUserExists(true);
        setUserInfo(data.user);
      } else {                        // if there was a server error during user creation 
        setUserJobStatus("Failed");
        setTimeout(() => {
          navigate('/client-dashboard')
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Page-specific validations
  const isPage1Valid = () => {
    return (
      formData.phoneNumber &&
      validatePhoneNumber(formData.phoneNumber) &&
      formData.email &&
      validateEmail(formData.email)
    )
  };

  const isPage2Valid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.city &&
      formData.state
    );
  };

  const isPage3Valid = () => {
    return formData.experienceLevel;
  };

  // Navigation through pages
  const nextPage = async () => {
    if (currentPage === 1 && !isPage1Valid()) {
      setErrors({
        phoneNumber: formData.phoneNumber ? errors.phoneNumber : 'Phone number is required.',
        email: formData.email ? errors.email : 'Email is required.',
      });
    } else if (currentPage === 2 && !isPage2Valid()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: formData.firstName ? '' : 'First Name is required.',
        lastName: formData.lastName ? '' : 'Last Name is required.',
        city: formData.city ? '' : 'City is required.',
        state: formData.state ? '' : 'State is required.',
      }));
    }

    if (currentPage === 1) {
      try {
        const res = await fetch(getApiUrl(`/auth/check-user/${formData.phoneNumber}`));
        const data = await res.json();

        if (res.ok) {                             // if an user already exists with formData.phoneNumber
          setUserExists(true);
          setUserInfo(data.user);
        } else {
          setErrors({});
          setCurrentPage(currentPage + 1);
        }
      } catch (error) {
        setMessage('An error occurred while inviting user. Please try again.');
      }
    } else {
      setErrors({});
      setCurrentPage(currentPage + 1);
    }
  };


  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const inviteUserToJob = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/user-jobs/`), {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId, user_id: userInfo.id, invite: true }),
      });


      if (res.ok) {                             // if a new user job is created successfully
        setUserJobStatus("Success");
        setTimeout(() => {
          navigate('/client-dashboard')
        }, 3000);
      } else if (res.status === 409) {          // if an user job already exists
        setUserJobExists(true);
        setTimeout(() => {
          navigate('/client-dashboard')
        }, 3000);
      } else {                                 // some other server error occurred while creating a user job
        setUserJobStatus("Failed");
        setTimeout(() => {
          navigate('/client-dashboard')
        }, 3000);
      }
    } catch (error) {
      console.log("Some error occurred", error.message);

    }
  }

  return (
    <div className="signup-container">
      {userExists && !userJobExists && <Modal headerText={`Do you want to invite ${userInfo.firstName} ${userInfo.lastName} to this job?`} buttonText='Invite' toggleModal={inviteUserToJob} />}
      {userJobExists && <Modal headerText={`${userInfo.firstName} ${userInfo.lastName} is already invited to this job.`} buttonText='Go Back' toggleModal={() => navigate('/client-dashboard')} />}

      {userJobStatus === "Failed" && <Modal headerText={`Some error occurred while adding ${formData.firstName} ${formData.lastName} to the job.`} buttonText='Go Back' toggleModal={() => navigate('/client-dashboard')} />}
      {userJobStatus === "Success" && <Modal headerText={`Successfully added ${userInfo.firstName} ${userInfo.lastName} to the job.`} buttonText='Go Back' toggleModal={() => navigate('/client-dashboard')} />}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Adding Applicant to Job...</div>
        </div>
      ) : (
        <div className="signup-main-content">
          <header className="signup-navbar">
            <div className="left">
              <Link to="/" className="logo">
                <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
              </Link>
            </div>
          </header>
          <h2 className='poppins-regular signup-heading'>INVITE USER TO JOB</h2>
          <form onSubmit={handleSubmit}>
            {currentPage === 1 && (
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
                <button type="button" className={`next-button ${!isPage1Valid() ? 'disabled' : ''}`} onClick={nextPage} disabled={!isPage1Valid()}>
                  Next
                </button>
              </>
            )}

            {currentPage === 2 && (
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
                    {["Intern", "Entry Level Job", "Senior Level Job"].map(level => (
                      <div
                        key={level}
                        className={`experience-option ${formData.experienceLevel === level ? 'selected' : ''}`}
                        onClick={() => handleExperienceSelect(level)}
                        required
                      >
                        <span>{level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="button" className="back-button" onClick={previousPage}>Back</button>
                <button type="submit" className={`submit-button ${!isPage3Valid() ? 'disabled' : ''}`} disabled={!isPage3Valid()}>
                  Invite User
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

export default InviteUserJob;
