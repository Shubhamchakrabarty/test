import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobListingPage.css';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useLogout } from '../utils/logout';
import Modal from './Modal'; // Modal component for Contact Us
import { FaUserCircle } from 'react-icons/fa';

const JobListingPage = () => {
    const { user } = useContext(UserContext);
    const [openJobs, setOpenJobs] = useState([]);
    const [eligibleJobsList, setEligibleJobsList] = useState([]);
    const [appliedJobsList, setAppliedJobsList] = useState([]);
    const [jobsWithVerdict, setJobsWithVerdict] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const logout = useLogout();
    const [activeTab, setActiveTab] = useState('applied');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const [jobResponse, screeningResponse, candidateCvResponse, userJobResponse] = await Promise.all([
                fetch(getApiUrl('/api/client-jobs')),
                fetch(getApiUrl('/api/client-job-screening-requirements')),
                fetch(getApiUrl(`/api/check-cv/${user.id}`)),
                fetch(getApiUrl(`/api/user-jobs/${user.id}`))
            ]);

            if (!jobResponse.ok || !screeningResponse.ok || !candidateCvResponse.ok || !userJobResponse.ok) {
                throw new Error('One or more API calls failed');
            }

            const [jobs, screeningRequirementsData, candidateCvData, userJobData] = await Promise.all([
                jobResponse.json(),
                screeningResponse.json(),
                candidateCvResponse.json(),
                userJobResponse.json()
            ]);

            // Ensure that the response data is an array
            const screeningRequirementsArray = Array.isArray(screeningRequirementsData) ? screeningRequirementsData : [];
            const candidateCvDetailsArray = candidateCvData && Array.isArray(candidateCvData.details) ? candidateCvData.details : [];
            const userJobsArray = Array.isArray(userJobData) ? userJobData : [];
            const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => job.status === "Open") : [];

            // Create a map for faster lookup of screening requirements by job_id
            const screeningRequirementsMap = screeningRequirementsArray.reduce((map, requirement) => {
                map[requirement.job_id] = requirement;
                return map;
            }, {});

            // Create a map for faster lookup of candidate CV details by job_id
            const candidateCvMap = candidateCvDetailsArray.reduce((map, cvDetail) => {
                map[cvDetail.job_id] = cvDetail;
                return map;
            }, {});

            // Assign screening requirements and CV upload status to jobs using the maps
            const jobsWithDetails = filteredJobs.map(job => {
                const screeningRequirement = screeningRequirementsMap[job.id];
                const candidateCvDetail = candidateCvMap[job.id];
                return {
                    ...job,
                    cvUploadRequired: screeningRequirement?.cvUploadRequired || false,
                    cvScreeningInstructions: screeningRequirement?.cvScreeningInstructions || '',
                    cvUploaded: !!candidateCvDetail,
                    cvFileUrl: candidateCvDetail?.file_url || ''
                };
            });
            console.log('jobsWithDetails:', jobsWithDetails);
            setOpenJobs(jobsWithDetails);

            // Map user jobs for faster lookups
            const eligibleJobs = userJobsArray.reduce((acc, userJob) => {
                if (userJob.status === "Eligible") acc[userJob.job_id] = userJob;
                return acc;
            }, {});

            const appliedJobs = userJobsArray.reduce((acc, userJob) => {
                if (userJob.status === "Applied" || userJob.status === "CV Matched" || userJob.status === "CV Partially Matched" || userJob.status === "CV Not Matched") acc[userJob.job_id] = userJob;
                return acc;
            }, {});

            // Create a map for faster lookup of verdicts by job_id
            const jobsWithVerdictMap = userJobsArray.reduce((map, userJob) => {
                if (userJob.status === "Accepted" || userJob.status === "Rejected") map[userJob.job_id] = userJob;
                return map;
            }, {});

            // Create eligible and applied jobs lists
            const eligibleJobsWithId = jobsWithDetails.filter(job => eligibleJobs[job.id]).map(job => ({
                ...job,
                userJobId: eligibleJobs[job.id].id
            }));
            setEligibleJobsList(eligibleJobsWithId);
            console.log('eligibleJobs:', eligibleJobsWithId);

            const appliedJobsWithId = jobsWithDetails.filter(job => appliedJobs[job.id]).map(job => ({
                ...job,
                userJobId: appliedJobs[job.id].id
            }));
            setAppliedJobsList(appliedJobsWithId);
            console.log('appliedJobs:', appliedJobsWithId);

            const jobsWithVerdictWithId = jobsWithDetails.filter(job => jobsWithVerdictMap[job.id]).map(job => ({
                ...job,
                userJobStatus: jobsWithVerdictMap[job.id].status,
                userJobId: jobsWithVerdictMap[job.id].id
            }));
            setJobsWithVerdict(jobsWithVerdictWithId);
            console.log('jobsWithVerdict:', jobsWithVerdictWithId);

            if (appliedJobsWithId.length > 0) {
                setActiveTab('applied');
            }
            else if (eligibleJobsWithId.length > 0) {
                setActiveTab('eligible');
            }
            else {
                setActiveTab('past');
            }
        } catch (error) {
            console.error('Error fetching job data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchJobs();
        }
    }, [user]);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'applied':
                return appliedJobsList.length > 0 ? (
                    <ul className="job-list">
                        {appliedJobsList.map(job => (
                            <li key={job.id} className="job-item poppins-regular">
                                <div className='job-item-container'>
                                    <div className='job-title-container'>
                                        <h3 className='job-title'>{job.job_title}</h3>
                                        <div className='poppins-regular tag-container'>
                                            <div className='tag poppins-light'>Applied on: {formatDate(job.updatedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='button-container'>
                                    <button
                                        onClick={() => {
                                            if(!job.cvUploadRequired || (job.cvUploadRequired && job.cvUploaded)) {
                                                navigate(`/interviews/${job.id}`);
                                            } else navigate('/cv-upload', { state: {jobId: job.id, userJobId: job.userJobId, isApplied: true} });
                                        }}
                                        className="apply-button poppins-regular"
                                    >
                                        Go to Interviews
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-jobs-message poppins-regular centered">
                        <p>No applied jobs found.</p>
                    </div>
                );

            case 'available':
                return eligibleJobsList.length > 0 ? (
                    <ul className="job-list">
                        {eligibleJobsList.map(job => (
                            <li key={job.id} className="job-item poppins-regular">
                                <div className='job-item-container'>
                                    <div className='job-title-container'>
                                        <h3 className='job-title'>{job.job_title}</h3>
                                    </div>
                                </div>
                                <div className='button-container'>
                                    <button
                                        onClick={() => navigate(`/job-details/${job.id}`, {
                                            state: { userJobId: job.userJobId }
                                        })}
                                        className="apply-button poppins-regular"
                                    >
                                        View Job Details
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-jobs-message poppins-regular centered">
                        <p>No available jobs found.</p>
                    </div>
                );

            case 'past':
                return jobsWithVerdict.length > 0 ? (
                    <ul className="job-list">
                        {jobsWithVerdict.map(job => (
                            <li key={job.id} className="job-item poppins-regular">
                                <div className='job-item-container'>
                                    <div className='job-title-container'>
                                        <h3 className='job-title'>{job.job_title}</h3>
                                    </div>
                                </div>
                                <div className={`verdict-container ${job.userJobStatus === 'Accepted' ? 'verdict-shortlisted' : 'verdict-rejected'
                                    }`}>
                                    <span className="verdict">
                                        {job.userJobStatus === 'Accepted' ? 'Shortlisted' : 'Rejected'}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-jobs-message poppins-regular centered">
                        <p>No past jobs found.</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="job-listing-page">
            <header className="signup-navbar">
                <div className="left">
                    <div>
                        <span className="logo">
                            <span className="logo-peh">Peh</span>
                            <span className="logo-chaan">chaan</span>
                        </span>
                    </div>
                    <div className="credentials">
                        <div className="mobile-user-info">
                            <FaUserCircle className="user-icon" onClick={toggleUserMenu} />
                            {isUserMenuOpen && (
                                <div className="interviewhr-dropdown-menu">
                                    <div className='poppins-regular'>
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <button
                                        className="button-theme poppins-regular"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <p className="loader-text">Loading jobs, please wait...</p>
                </div>
            ) : (
                <>
                    <div className="tabs">
                        <button
                            className={`tab-button ${activeTab === 'applied' ? 'active' : ''}`}
                            onClick={() => setActiveTab('applied')}
                        >
                            Applied Jobs
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
                            onClick={() => setActiveTab('available')}
                        >
                            Available Jobs
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            Past Jobs
                        </button>
                    </div>

                    <div className="tab-content">
                        {renderTabContent()}
                    </div>

                    {appliedJobsList.length === 0 &&
                        eligibleJobsList.length === 0 &&
                        jobsWithVerdict.length === 0 && !loading && (
                            <div className="no-jobs-message poppins-semibold centered">
                                <p>You have not been invited to any jobs. Please contact us for any queries.</p>
                                <button
                                    className="primary poppins-medium"
                                    onClick={toggleModal}
                                >
                                    Contact Us
                                </button>
                            </div>
                        )}

                    {modalOpen && (
                        <Modal
                            toggleModal={toggleModal}
                            headerText="Contact Us"
                            bodyText="Please reach out to us at: kunal@pehchaan.me"
                            buttonText="Close"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default JobListingPage;