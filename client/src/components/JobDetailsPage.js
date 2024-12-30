import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./JobDetailsPage.css";
import { UserContext } from "../context/UserContext";
import { getApiUrl } from "../utils/apiUtils";

const JobDetailsPage = () => {
  const location = useLocation();
  const { jobId } = useParams();
  const { user } = useContext(UserContext);
  const [jobDetails, setJobDetails] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvUploadRequired, setCVUploadRequired] = useState(false);
  const { userJobId } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/client-jobs/${jobId}`));
        const data = await response.json();
        setJobDetails(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    const fetchInterviews = async () => {
      try {
        const interviewsResponse = await fetch(getApiUrl(`/api/client-jobs/${jobId}/interviews`));
        if (!interviewsResponse.ok) {
          throw new Error('Failed to fetch interviews');
        }
        const interviewsData = await interviewsResponse.json();
        const sortedInterviews = interviewsData.sort((a, b) => a.client_job_interview_order - b.client_job_interview_order);
        setInterviews(sortedInterviews);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching interviews.');
      }
    };
    const getCVScreeningRequired = async () => {
      try {
          const screeningRes = await fetch(getApiUrl(`/api/client-job-screening-requirements/job/${jobId}`));
          if (screeningRes.ok) {
              const screeningData = await screeningRes.json();
              console.log(screeningData);
              setCVUploadRequired(screeningData?.cvUploadRequired ?? false);
          }
      } catch (error) {
          console.warn('Error fetching screening details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews()
    fetchJobDetails();
    getCVScreeningRequired();
  }, [jobId]);
  console.log(interviews)

  const handleApply = async () => {
    if (!user?.id) return;
    
    // Redirect according to the cvUploadRequired field 
    try {
      const response = await fetch(getApiUrl(`/api/user-jobs/${userJobId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Applied" }),
      });

      if (response.ok) {
        console.log("Job applied successfully");
        if(cvUploadRequired) navigate('/cv-upload', { state: {jobId, userJobId, isApplied: false} });
        else navigate(`/interviews/${jobId}`);
        
      } else {
        console.error("Failed to apply for job");
        navigate("/jobs");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
    }
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    return date.toLocaleDateString('en-GB', options);
  };

  if (!jobDetails) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">Loading jobs, please wait...</p>
      </div>
    );
  }

  return (
    <div className="job-details-page-container">
      <header className="dashboard-navbar">
        <div className="left poppins-regular">
          <Link to="/" className="logo" style={{ textDecoration: 'none', marginBottom: '0px', marginTop: '10px' }}>
            <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
          </Link>
        </div>
        <div className="poppins-regular" style={{ marginBottom: '0px' }}>
          <Link to="/jobs" className="job-listings-nav">
            Job Listings
          </Link>
          &gt; Job Details
        </div>
      </header>
      <div className="job-details-page">
        <div className="left">
          <h1>{jobDetails.job_title}</h1>
          <div className='poppins-medium'>
            <span className='tag'>Published on: {formatDate(jobDetails.createdAt)}</span> {/* Display created date */}
          </div>
          <div className="job-description">
            <strong>Job Description:</strong>
            <p style={{ whiteSpace: "pre-line" }}>
              {jobDetails.job_description.trim()}
            </p>
          </div>
        </div>
        <div className="right">
          <h2>Interview Rounds</h2>
          {interviews.length === 0 ? (
            <p>No interviews available for this job.</p>
          ) : (
            <ul className="interview-list">
              {interviews.map((interview, index) => (
                <li
                  key={index}
                  className={`interview-item ${interview.completed ? 'completed' : ''}`}
                >
                  {index + 1}.  {interview.interview.interview_name}
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleApply} className="apply-button">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;