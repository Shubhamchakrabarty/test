import React, { useState, useEffect, useContext } from 'react';
import { getApiUrl } from '../utils/apiUtils';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import ReusableOTPVerification from './ReusableOTPVerification';
import "./JobApply.css"

function JobApply() {
    const { jobURL } = useParams();
    const [jobId, setJobId] = useState();
    const [jobTitle, setJobtitle] = useState('');
    const [showJobFetchError, setShowJobFetchError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [userExists, setUserExists] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [userJobStatus, setUserJobStatus] = useState('Pending');
    const [showOTPScreen, setShowOTPScreen] = useState(false);
    const [sendPhoneOTP, setSendPhoneOTP] = useState(false);
    const [sendEmailOTP, setSendEmailOTP] = useState(false);
    const { setUser } = useContext(UserContext);
    // const [loadIconOnTop, setLoadIconOnTop] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        city: '',
        state: '',
        experienceLevel: ''
    });

    // Function to handle user info after OTP verification
    const handleUserInfoOnOTP = async (user) => {
        setUserInfo(user);
        // Only proceed with job invitation after user info is set
        if (user && user.id) {
            await inviteUserToJob(user);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phoneNumber) => {
        const re = /^\d{10}$/;
        return re.test(phoneNumber);
    };

    useEffect(() => {
        async function decodeURL() {
            setLoading(true);
            setLoadingText('Loading...');
            try {
                const res = await fetch(getApiUrl(`/api/client-jobs/job/${jobURL}`));
                const data = await res.json();
                setLoading(false);
                setLoadingText('');
                if (res.ok) {
                    setJobId(data.job.id);
                    setJobtitle(data.job.job_title);
                } else {
                    setShowJobFetchError(true);
                    setMessage(data.message);
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } catch (error) {
                setShowJobFetchError(true);
                setMessage('Failed to fetch job details');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        }
        if (jobURL) {
            decodeURL();
        }
        return () => {
            clearTimeout();
        }
    }, [jobURL, navigate]);

    const isPage1Valid = () => {
        return (
            formData.phoneNumber &&
            validatePhoneNumber(formData.phoneNumber)
        );
    };

    const isPage2Valid = () => {
        return (
            formData.firstName &&
            formData.lastName &&
            formData.city &&
            formData.state &&
            formData.email &&
            validateEmail(formData.email)
        );
    };

    const isPage3Valid = () => {
        return formData.experienceLevel;
    };

    const nextPage = async () => {
        if (currentPage === 1 && !isPage1Valid()) {
            setErrors({
                phoneNumber: formData.phoneNumber ? errors.phoneNumber : 'Phone number is required.'
            });
            return;
        }

        if (currentPage === 2 && !isPage2Valid()) {
            setErrors({
                ...errors,
                firstName: formData.firstName ? '' : 'First Name is required.',
                lastName: formData.lastName ? '' : 'Last Name is required.',
                email: formData.email ? errors.email : 'Email is required.',
                city: formData.city ? '' : 'City is required.',
                state: formData.state ? '' : 'State is required.',
            });
            return;
        }

        if (currentPage === 1) {
            try {
                // setLoadIconOnTop(true);
                const res = await fetch(getApiUrl(`/auth/check-user/${formData.phoneNumber}`));
                const data = await res.json();

                if (res.ok) {
                    const senderObj = {
                        phoneNumber: formData.phoneNumber
                    }
                    const loginRes = await fetch(getApiUrl('/auth/login'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(senderObj),
                    });
                    const loginData = await loginRes.json();
                    if (!loginRes.ok) {
                        if (loginData.message.includes('OTP limit reached')) {
                            setMessage('You have reached the OTP request limit. Please wait 30 minutes before trying again.');
                            // setLoadIconOnTop(false);
                            return;
                        }
                        setMessage(loginData.message || 'Failed to authenticate user');
                        // setLoadIconOnTop(false);
                        return;
                    }

                    // setLoadIconOnTop(false);
                    setUserExists(true);
                    setSendEmailOTP(loginData.emailSent);
                    setSendPhoneOTP(loginData.smsSent);
                    setFormData((prevData) => ({
                        ...prevData,
                        email: loginData.userDetails.email,
                        firstName: loginData.userDetails.firstName
                    }));
                    setShowOTPScreen(true);
                } else if (res.status === 404) {
                    setErrors({});
                    setCurrentPage(currentPage + 1);
                } else {
                    setMessage('An error occurred while checking user. Please try again.');
                }
            } catch (error) {
                setMessage('An error occurred while checking user. Please try again.');
            }
        } else {
            setErrors({});
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

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

    const handleOTPVerificationComplete = () => {
        setShowOTPScreen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoadingText('Creating your account...');
        try {
            const res = await fetch(getApiUrl('/auth/signUp'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.message.includes('OTP limit reached')) {
                    setMessage('You have reached the OTP request limit. Please wait 30 minutes before trying again.');
                    return;
                }
                throw new Error(data.message || 'Failed to create user');
            }

            if (data) {
                setUserExists(true);
                setSendEmailOTP(data.emailSent);
                setSendPhoneOTP(data.smsSent);
                setShowOTPScreen(true);
            } else {
                setUserJobStatus("Failed");
            }
        } catch (error) {
            console.error(error);
            setMessage(error.message || 'An error occurred while creating your account');
        }
        setLoading(false);
    };

    const inviteUserToJob = async (currentUser) => {
        try {
            setLoading(true);
            setLoadingText("Processing your application...");

            const userToUse = currentUser || userInfo;
            if (!userToUse || !userToUse.id) {
                throw new Error('User information not available');
            }

            const res = await fetch(getApiUrl(`/api/user-jobs/`), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: jobId,
                    user_id: userToUse.id
                }),
            });

            const data = await res.json();

            if (res.ok) {                          // If an userjob does not already exist
                navigate(`/job-details/${jobId}`, {
                    state: { userJobId: data.id }
                });
            } else if (res.status === 409) {        // If an userjob already exists
                let cvUploadRequired = false;
                const screeningRes = await fetch(getApiUrl(`/api/client-job-screening-requirements/job/${jobId}`));
                if (screeningRes.ok) {
                    const screeningData = await screeningRes.json();
                    // Set cvUploadRequired based on the response or default to false if no data
                    cvUploadRequired = screeningData?.cvUploadRequired ?? false;
                } else if (screeningRes.status === 404) {
                    // No entry in the database; default cvUploadRequired to false
                    cvUploadRequired = false;
                } else {
                    throw new Error('Failed to retrieve screening requirements');
                }

                const existingUserJob = data.userJob;
                
                if(existingUserJob.status === 'Applied' ) {
                    if(cvUploadRequired) {
                        navigate('/cv-upload', { 
                            state: {jobId: jobId, userJobId: data.id, isApplied: true}
                        });
                    } else {
                        navigate(`/interviews/${jobId}`);
                    }
                } else if(existingUserJob.status === 'CV Matched' || existingUserJob.status === 'CV Partially Matched' || existingUserJob.status === 'CV Not Matched') {
                    // redirecting to the interviews page 
                    navigate(`/interviews/${jobId}`);
                } else if (existingUserJob.status === 'Eligible') {
                    // redirecting to the job details page  
                    navigate(`/job-details/${jobId}`, {
                        state: { userJobId: existingUserJob.id }
                    });
                } else {
                    setMessage('Unable to process your application at this time');
                    navigate('/');
                }
            } else {
                setMessage('Failed to process job application');
                navigate('/');
            }
        } catch (error) {
            console.error("Error inviting user to job:", error);
            setMessage('Failed to process job application');
            navigate('/');
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    if (showJobFetchError) {
        return (
            <div className="job-error">
                <p>{message}</p>
                <p>Redirecting to the homepage...</p>
            </div>
        );
    }

    return (
        <>
            {/* {loadIconOnTop && (
                <div className="loader-on-top">
                    <div className="loader-spinner"></div>
                </div>
            )} */}
            {!showOTPScreen && (
                <div className="signup-container">
                    {loading ? (
                        <div className="loader-container">
                            <div className="loader"></div>
                            <div className="loader-message">{loadingText}</div>
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
                            <h2 className='poppins-regular signup-heading'>{jobTitle}</h2>
                            <h3 className='poppins-regular signup-heading'>Enter your credentials to continue</h3>
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


                                        <button
                                            type="button"
                                            className={`next-button ${!isPage1Valid() ? 'disabled' : ''}`}
                                            onClick={nextPage}
                                            disabled={!isPage1Valid()}
                                        >
                                            Proceed
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
                                        <button
                                            type="button"
                                            className={`next-button ${!isPage2Valid() ? 'disabled' : ''}`}
                                            onClick={nextPage}
                                            disabled={!isPage2Valid()}
                                        >
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
                                                    >
                                                        <span>{level}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="button" className="back-button" onClick={previousPage}>Back</button>
                                        <button
                                            type="submit"
                                            className={`submit-button ${!isPage3Valid() ? 'disabled' : ''}`}
                                            disabled={!isPage3Valid()}
                                        >
                                            Proceed
                                        </button>
                                    </>
                                )}
                            </form>

                            {message && <p className="error-text">{message}</p>}
                        </div>
                    )}
                </div>
            )}
            {userExists && showOTPScreen && (
                <ReusableOTPVerification
                    phoneNumber={formData.phoneNumber}
                    email={formData.email}
                    onVerificationComplete={handleOTPVerificationComplete}
                    firstName={formData.firstName}
                    handleUserInfoOnOTP={handleUserInfoOnOTP}
                    smsSent={sendPhoneOTP}
                    emailSent={sendEmailOTP}
                />
            )}
        </>
    );
}

export default JobApply;	