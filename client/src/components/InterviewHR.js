import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import greenCheck from '../assets/green_check.webp';
import './InterviewHR.css';
import highlightedIcon from '../assets/highlighted.svg'
import { useLogout } from '../utils/logout';
import { FaUserCircle } from 'react-icons/fa';

const InterviewHR = () => {
  const { jobId } = useParams(); // Extract interviewId from URL params
  const { user } = useContext(UserContext);
  const [jobDetails, setJobDetails] = useState([])
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [individualInterviewTimes, setIndividualInterviewTimes] = useState([]);
  const logout = useLogout(); // for logging out


  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch interviews linked to the specific jobId
        const jobDetails = await fetch(getApiUrl(`/api/client-jobs/${jobId}`));
        if (!jobDetails.ok) {
          throw new Error('Failed to fetch interviews');
        }
        const jobDetailsData = await jobDetails.json();
        setJobDetails(jobDetailsData);

        // Fetch interviews linked to the specific jobId
        const interviewsResponse = await fetch(getApiUrl(`/api/client-jobs/${jobId}/interviews`));

        if (!interviewsResponse.ok) {
          throw new Error('Failed to fetch interviews');
        }
        const interviewsData = await interviewsResponse.json();
        console.log(interviewsData);

        // Sort interviews by order and determine availability
        const sortedInterviews = interviewsData.sort((a, b) => a.client_job_interview_order - b.client_job_interview_order);

        const interviewsWithStatus = await Promise.all(
          sortedInterviews.map(async (interview, index) => {
            // add new api route for fetching client job interview attemps and statuses
            const attemptResponse = await fetch(getApiUrl(`/api/client-job-interview/attempt?clientJobInterviewId=${interview.client_job_interview_id}&userId=${user.id}`));
            const attemptData = await attemptResponse.json();

            return {
              ...interview,
              ...attemptData,
            };
          })
        );

        setInterviews(interviewsWithStatus);

        const timesInMinutes = interviewsWithStatus.map(interview => Math.ceil(interview.interview.interview_time_limit / 60));
        setIndividualInterviewTimes(timesInMinutes);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user, jobId]);
  // console.log(interviews);

  // const formatDate = (isoString) => {
  //   const date = new Date(isoString);
  //   const options = {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric'
  //   };

  //   return date.toLocaleDateString('en-GB', options);
  // };

  const totalTime = individualInterviewTimes.reduce((acc, time) => acc + time, 0);

  const secondsToMinutes = (seconds) => {
    const minute = Math.ceil(seconds / 60);
    return `${minute} min`;
  }

  const allInterviewsAttempted = interviews.every(interview => interview.completed_count > 0);

  const totalInterviews = interviews.length;

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">Loading interviews, please wait...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <p>Please log in to view this page.</p>;
  }


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="interview-hr-container">
      <header className="interview-hr-navbar">

        <div className="poppins-regular" style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to="/" className="logo" style={{ textDecoration: 'none', marginBottom: '2px' }}>
            <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
          </Link>
          <div>
            <Link to="/jobs" className="job-listings-nav">
              Job Listings
            </Link>
            &gt; Interviews
          </div>
        </div>
        <div className="credentials">
          {/* <div className='desktop-user-info '>
            <div className="poppins-semibold">{user.firstName} {user.lastName}</div>
            <div className="logout-button"><button className="button-theme poppins-regular" onClick={logout}>Logout</button></div>
          </div> */}
          <div className="mobile-user-info">
            <FaUserCircle className="user-icon" onClick={toggleMenu} />
            {showMenu && (
              <div className="interviewhr-dropdown-menu">
                <div className='poppins-regular'>{user.firstName} {user.lastName}</div>
                <button className="button-theme poppins-regular" onClick={logout}>Logout</button>
              </div>
            )}
          </div>

        </div>
      </header>
      <div className="interview-hr-main-content-container">
        <div className="interview-hr-main-content">
          <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 className="poppins-semibold" style={{ margin: '10px 20px', fontSize: '20px' }}>{jobDetails.job_title}</h2>
            {/* <div className='poppins-medium'>
              <div className='tag'>Created on: {formatDate(jobDetails.createdAt)}</div>
            </div> */}
            <hr style={{ width: '95%', fontSize: '1px', color: '#fff' }} />
            <div className='interview-and-time' >
              <div className='poppins-medium'>Please complete<span style={{ color: '#edc500' }}> {totalInterviews} </span> Interviews to be eligible for selection</div>
              <div className='poppins-medium'>Maximum Time :<span style={{ color: '#edc500' }}> {secondsToMinutes(totalTime * 60)}</span></div>

            </div>
          </div>
          {allInterviewsAttempted && (
            <div className="all-interviews-completed">
              <p className="poppins-medium">All interviews have been attempted. We will get back to you with the results soon.</p>
            </div>
          )}
          <div className="scrollable-container">
            <ul className="interview-list">
              {interviews.map((interview, index) => {
                const isCompleted = interview.completed_count > 0;
                console.log("is completed", isCompleted);
                const allAttemptsExhausted = interview.started_count >= 3;
                console.log("all attempt exhusted", allAttemptsExhausted);

                const nextAvailableInterviewIndex = interviews.findIndex(
                  i => i.completed_count === 0 && i.started_count < 3
                );
                console.log("next idx", nextAvailableInterviewIndex)

                const isNextToAttempt = (index === nextAvailableInterviewIndex) && nextAvailableInterviewIndex !== -1;
                console.log("is next to attempt", isNextToAttempt);
                const isPreviousInterview = (index < nextAvailableInterviewIndex && interview.started_count > 0) || nextAvailableInterviewIndex === -1;
                console.log("is previous interview", isPreviousInterview);

                let statusClass = '';

                if (isNextToAttempt) statusClass = 'next-to-attempt';
                else if (isCompleted) statusClass = 'completed';
                else if (allAttemptsExhausted) statusClass = 'exhausted';

                let logoToShow = null;

                if (interview.completed_count >= 1) {
                  logoToShow = <img className="check" src={greenCheck} height='20' alt='check icon' />;
                } else if (isNextToAttempt) {
                  logoToShow = <img className="check" src={highlightedIcon} height='20' alt='highlighted icon' />;
                }

                return (
                  <li
                    key={interview.client_job_interview_id}
                    className={`poppins-medium interview-item ${statusClass}`}
                    style={{ opacity: isNextToAttempt ? 1 : 0.5 }}
                  >
                    <div className={`poppins-medium interview-link ${interview.available ? '' : ''}`} >
                      <span className="serial-number poppins-medium">
                        {index + 1}
                      </span>
                      <span className='interview-name'>
                        {interview.interview.interview_name}
                      </span>
                      <span className="tag normal-screen-tag">
                        {secondsToMinutes(interview.interview.interview_time_limit)}
                      </span>
                      <span>
                        {logoToShow}
                      </span>
                    </div>
                    <div className="interview-attempts">
                      <div className="attemps-info">
                        <div className="attempts-progress">
                          <div className={`pill ${interview.started_count >= 3 ? 'faded' : ''}`}></div>
                          <div className={`pill ${interview.started_count >= 2 ? 'faded' : ''}`}></div>
                          <div className={`pill ${interview.started_count >= 1 ? 'faded' : ''}`}></div>
                        </div>
                        <div className="attempts-left">
                          {Math.max(0, 3 - interview.started_count)} Attempts Left
                        </div>
                      </div>
                      <div>
                        <button
                          className={`start-interview-btn poppins-medium ${allAttemptsExhausted || (!isNextToAttempt && !isPreviousInterview) ? "disabled" : "enabled"} ${isNextToAttempt ? "highlight" : ""}`}
                          onClick={() => { navigate(`/interview/${interview.client_job_interview_id}`) }}
                          disabled={allAttemptsExhausted || (!isNextToAttempt && !isPreviousInterview)}
                        >
                          {interview.started_count > 0 ? "Retry" : "Start Now!"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHR;
