import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import './JobDetails.css';
import { ClientUserContext } from '../context/ClientUserContext';

const JobDetails = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [interviews, setInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [expandedInterviewId, setExpandedInterviewId] = useState(null);  // For toggling interview details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { clientUser } = useContext(ClientUserContext); // Fetch client user from context
    const navigate = useNavigate();
    const [showFullDescription, setShowFullDescription] = useState(false);


    // Fetch Job and Interviews when component mounts
    useEffect(() => {

        if (!clientUser || !clientUser.client_id) {
            // If client user context or client_id is missing, redirect to login
            console.error('Client user not available, redirecting to login.');
            navigate('/client-login');
            return;
        }
        const fetchJobDetails = async () => {
            try {
                // Fetch Job details
                const jobResponse = await fetch(getApiUrl(`/api/client-jobs/${jobId}`));
                if (!jobResponse.ok) throw new Error('Failed to fetch job details');
                const jobData = await jobResponse.json();
                setJob(jobData);
                // Fetch Interviews linked to this Job
                const interviewsResponse = await fetch(getApiUrl(`/api/client-jobs/${jobId}/interviews`));
                if (!interviewsResponse.ok) throw new Error('Failed to fetch interviews');
                const interviewsData = await interviewsResponse.json();
                // Sort interviews by order and determine availability
                const sortedInterviews = interviewsData.sort((a, b) => a.client_job_interview_order - b.client_job_interview_order);
                setInterviews(sortedInterviews);
            } catch (error) {
                console.error('Error fetching job/interviews:', error);
                setError('Failed to load job details and interviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, clientUser, navigate]);

    // Fetch Interview details when drilling down
    const handleInterviewClick = async (clientJobInterviewId) => {
        try {
            const interviewResponse = await fetch(getApiUrl(`/api/interviews/client-job-interview/${clientJobInterviewId}/details`));
            if (!interviewResponse.ok) throw new Error('Failed to fetch interview details');
            const interview = await interviewResponse.json();
            setSelectedInterview(interview.interviewData);
        } catch (error) {
            console.error('Error fetching interview details:', error);
            setError('Failed to load interview details.');
        }
    };

    const toggleInterview = (interviewId) => {
        setExpandedInterviewId(interviewId === expandedInterviewId ? null : interviewId);
    };

    // Function to toggle the visibility of the full job description
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <p className="loader-text">Loading job details, please wait...</p>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        return date.toLocaleDateString('en-GB', options);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(job.job_link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset copy message after 2 seconds
    };

    return (
        <div className="job-details-container-outer">
            <header className="dashboard-navbar">
                <div className="left poppins-regular">
                    <Link to="/" className="logo" style={{ textDecoration: 'none', marginBottom: '0px', marginTop: '10px' }}>
                        <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
                    </Link>
                </div>
                <div className="poppins-regular">
                    <Link to="/client-dashboard" className="job-listings-nav">
                        Job Listings
                    </Link>
                    &gt;{" "}
                    Job Details
                </div>
            </header>
            <div className="job-title-container">
                <div className="job-title-subcontainer">
                    <h2 className='poppins-bold job-title'> {job?.job_title}</h2>
                </div>
                <div className="copy-url-container">
                    {job?.job_link && (
                        <button className="copy-url-button poppins-medium" onClick={handleCopy}>
                            {isCopied ? 'Copied!' : 'Copy Job Link'}
                        </button>
                    )}
                </div>
            </div>
            {/* Job Description Header */}
            <div className='job-description'>
                <p className='poppins-medium' style={{ whiteSpace: "pre-line", lineHeight: "2" }}>
                    {showFullDescription
                        ? job?.job_description.trim()
                        : `${job?.job_description.substring(0, 50)}...`}  {/* Show the first 20 characters */}
                </p>

                <div>
                    <button className="btn poppins-medium" onClick={toggleDescription}>
                        {showFullDescription ? "Read Less" : "Read More"}
                    </button>
                </div>
            </div>
            <div className='poppins-medium published-date'>
                <span className='tag'>Published on: {formatDate(job.createdAt)}</span> {/* Display created date */}
            </div>

            <h2>Interviews</h2>
            <ul className="interviews-list">
                {interviews.map(interview => (
                    <li key={interview.client_job_interview_id} onClick={() => {
                        toggleInterview(interview.client_job_interview_id);
                        handleInterviewClick(interview.client_job_interview_id);
                    }}>
                        <div className='interview-name-and-toggle'>
                            <span className='poppins-medium'>{interview.interview.interview_name}</span>
                            <div className="toggle-view-hide poppins-medium">
                                {expandedInterviewId === interview.client_job_interview_id ? "Hide Details" : "View Details"}
                            </div>
                        </div>
                        {/* Drill down into Interview details */}
                        {expandedInterviewId === interview.client_job_interview_id && (
                            <div className="interview-details poppins-regular">
                                <h2>{selectedInterview?.interview?.interview_name}</h2>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <div className='poppins-medium'>
                                        <span className='tag'><strong>Time Limit:</strong> {selectedInterview?.interview?.interview_time_limit} seconds</span> {/* Display created date */}
                                    </div>
                                    <div className='poppins-medium'>
                                        <span className='tag'><strong>Time Limit per Answer:</strong> {selectedInterview?.interview?.time_limit_per_answer} seconds</span> {/* Display created date */}
                                    </div>
                                    <div className='poppins-medium'>
                                        <span className='tag'><strong>Status:</strong> {selectedInterview?.interview?.status}</span> {/* Display created date */}
                                    </div>
                                </div>

                                {/* <p><strong>Time Limit:</strong> {selectedInterview?.interview?.interview_time_limit} seconds</p>
                                <p><strong>Time Limit per Answer:</strong> {selectedInterview?.interview?.time_limit_per_answer} seconds</p>
                                <p><strong>Status:</strong> {selectedInterview?.interview?.status}</p> */}
                                <div className='instructions-container poppins-regular'>
                                    <h4>Pre-Interview Instructions</h4>
                                    <h5>Instructions</h5>
                                    <p>{selectedInterview?.interview?.instructions?.pre_interview_instructions || "No specific instructions"}</p>
                                    <h5>Welcome Message</h5>
                                    <p>{selectedInterview?.interview?.instructions?.welcome_message || "No welcome message"}</p>

                                    {/* Conditionally render the welcome video iframe */}
                                    {selectedInterview?.interview?.instructions?.welcome_video_url && (
                                        <div>
                                            <h5>Welcome Video</h5>
                                            <iframe
                                                src={selectedInterview.interview?.instructions.welcome_video_url}
                                                frameBorder="0"
                                                allow="autoplay; fullscreen"
                                                allowFullScreen
                                                title="Welcome Video"
                                                className="iframe-video"
                                            />
                                        </div>
                                    )}

                                    {/* Conditionally render the context video iframe */}
                                    {selectedInterview?.interview?.instructions?.context_video_url && (
                                        <div>
                                            <h5>Context Video</h5>
                                            <iframe
                                                src={selectedInterview.interview?.instructions.context_video_url}
                                                frameBorder="0"
                                                allow="autoplay; fullscreen"
                                                allowFullScreen
                                                title="Context Video"
                                                className="iframe-video"
                                            />
                                        </div>
                                    )}
                                </div>

                                <h4 className='poppins-bold'>Interview Questions</h4>
                                <ul className="questions-list poppins-regular">
                                    {selectedInterview?.interview?.interview_questions
                                        ?.sort((a, b) => a.question_order - b.question_order) // Sort questions by question_order
                                        .map(question => (
                                            <li key={question.id}>
                                                <div className='left'>
                                                    <p><strong>Question {question.question_order}:</strong> {question.question.question_text}</p>
                                                    <p><strong>Instructions:</strong> {question.question.text_instructions}</p>
                                                    <p><strong>Question Set:</strong> {question.question_set}</p>
                                                </div>
                                                <div className='right'>
                                                    {question.question.media_url && (
                                                        <iframe
                                                            src={question.question.media_url}
                                                            frameBorder="0"
                                                            allow="autoplay; fullscreen"
                                                            allowFullScreen
                                                            title={`Media for Question ${question.question_order}`}
                                                            className="iframe-video"
                                                        />
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default JobDetails;
