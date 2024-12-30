import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { PiExport, PiFileCsv, PiFilePdfLight, PiFileXls, PiDownload } from "react-icons/pi";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './JobCandidatesList.css';
import { getApiUrl } from '../utils/apiUtils';
import Modal from './Modal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function JobCandidateList() {
    const { clientJobId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobData, setJobData] = useState({});
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate();
    const gridRef = useRef(null);

    const [jobApplicationStarted, setJobApplicationStarted] = useState(0);
    const [jobApplicationCompleted, setJobApplicationCompleted] = useState(0);
    const [startedInterviews, setStartedInterviews] = useState(0);
    const [completedInterviews, setCompletedInterviews] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState({
        bodyText: '',
        headerText: '',
        buttonText: ''
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    async function refreshPageData() {
        try {
            setLoading(true);
            const jobDetails = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}`));
            const jobDetailsData = await jobDetails.json();
            setJobData(jobDetailsData);

            const interviewsResponse = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}/interviews`));
            const interviewsData = await interviewsResponse.json();
            setInterviews(interviewsData);

            const userJobsResponse = await fetch(getApiUrl(`/api/user-jobs/job/${clientJobId}`));
            const userJobsData = await userJobsResponse.json();

            // Filter out duplicate users keeping only the most recent entries
            const uniqueUserJobs = Object.values(
                userJobsData.reduce((acc, current) => {
                    const key = `${current.email}_${current.phoneNumber}`;
                    if (!acc[key] || new Date(current.createdAt) > new Date(acc[key].createdAt)) {
                        acc[key] = current;
                    }
                    return acc;
                }, {})
            );
            const candidatesWithAttempts = await Promise.all(
                uniqueUserJobs.map(async (userJob) => {
                    if (interviewsData.length > 0) {
                        // Fetch attempts for all interviews
                        const allInterviewAttempts = await Promise.all(
                            interviewsData.map(interview =>
                                fetchInterviewAttempts(userJob.user_id, interview.client_job_interview_id)
                            )
                        );

                        // Calculate completion status
                        const totalInterviews = interviewsData.length;
                        const completedInterviews = allInterviewAttempts.filter(attempt => attempt.isCompleted).length;
                        const hasStartedAny = allInterviewAttempts.some(attempt => attempt.isStarted);
                        const cvStatus = await checkCvUpload(userJob.user_id);
                        return {
                            ...userJob,
                            interviewStatus: {
                                hasStartedAny,                              // true if at least one interview was started
                                hasCompletedAll: completedInterviews === totalInterviews,  // true only if all interviews are completed
                                completedInterviews,                        // number of completed interviews
                                totalInterviews,                           // total number of interviews
                                interviewProgress: `${completedInterviews}/${totalInterviews}` // e.g., "2/3" interviews completed
                            },
                            cvStatus: cvStatus
                        };
                    }
                    return userJob;
                })
            );

            setLoading(false);
            setCandidates(candidatesWithAttempts);
            setJobTitle(jobDetailsData.job_title || 'Job Title Not Available');

            // Calculate counts
            let started = 0, completed = 0, startedInt = 0, completedInt = 0;
            candidatesWithAttempts.forEach(candidate => {
                // console.log(candidate);
                const status = getInterviewStatus(candidate);
                started++;
                if (status === "Job Application - Completed") completed++;
                if (status === "Started interviews") {
                    completed++;
                    startedInt++;
                }
                if (status === "Completed interviews") {
                    completedInt++;
                    completed++;
                    startedInt++;
                }
            });

            setJobApplicationStarted(started);
            setJobApplicationCompleted(completed);
            setStartedInterviews(startedInt);
            setCompletedInterviews(completedInt);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }
    function handleToggleModal() {
        setShowModal(!showModal);
    }

    const checkCvUpload = async (userId) => {
        try {
            const response = await fetch(getApiUrl(`/api/check-cv/${userId}/${clientJobId}`));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking CV upload:', error);
            return { uploaded: false };
        }
    };

    const handleCvDownload = (fileUrl) => {
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = ''; // This attribute prompts the browser to download the file
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor); // Clean up after the click event
    };

    // const fetchInterviewAttempts = async (userId, clientJobInterviewId) => {
    //     try {
    //         const response = await fetch(
    //             getApiUrl(`/api/client-job-interview/attempt?clientJobInterviewId=${clientJobInterviewId}&userId=${userId}`)
    //         );
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error('Error fetching interview attempts:', error);
    //         return null;
    //     }
    // };

    const fetchInterviewAttempts = async (userId, clientJobInterviewId) => {
        try {
            const response = await fetch(
                getApiUrl(`/api/client-job-interview/attempt?clientJobInterviewId=${clientJobInterviewId}&userId=${userId}`)
            );
            const data = await response.json();
            return {
                clientJobInterviewId,
                isCompleted: data.completed_count > 0,
                isStarted: data.started_count > 0
            };
        } catch (error) {
            console.error('Error fetching interview attempts:', error);
            return {
                clientJobInterviewId,
                isCompleted: false,
                isStarted: false
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const jobDetails = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}`));
                const jobDetailsData = await jobDetails.json();
                setJobData(jobDetailsData);

                const interviewsResponse = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}/interviews`));
                const interviewsData = await interviewsResponse.json();
                setInterviews(interviewsData);

                const userJobsResponse = await fetch(getApiUrl(`/api/user-jobs/job/${clientJobId}`));
                const userJobsData = await userJobsResponse.json();

                // Filter out duplicate users keeping only the most recent entries
                const uniqueUserJobs = Object.values(
                    userJobsData.reduce((acc, current) => {
                        const key = `${current.email}_${current.phoneNumber}`;
                        if (!acc[key] || new Date(current.createdAt) > new Date(acc[key].createdAt)) {
                            acc[key] = current;
                        }
                        return acc;
                    }, {})
                );

                // const candidatesWithAttempts = await Promise.all(
                //     uniqueUserJobs.map(async (userJob) => {
                //         if (userJob.status === "Applied" && interviewsData.length > 0) {
                //             const firstInterview = interviewsData[0];
                //             const attempts = await fetchInterviewAttempts(
                //                 userJob.user_id,
                //                 firstInterview.client_job_interview_id
                //             );
                //             return {
                //                 ...userJob,
                //                 interviewAttempts: attempts
                //             };
                //         }
                //         return userJob;
                //     })
                // );

                const candidatesWithAttempts = await Promise.all(
                    uniqueUserJobs.map(async (userJob) => {
                        if (interviewsData.length > 0) {
                            // Fetch attempts for all interviews
                            const allInterviewAttempts = await Promise.all(
                                interviewsData.map(interview =>
                                    fetchInterviewAttempts(userJob.user_id, interview.client_job_interview_id)
                                )
                            );

                            // Calculate completion status
                            const totalInterviews = interviewsData.length;
                            const completedInterviews = allInterviewAttempts.filter(attempt => attempt.isCompleted).length;
                            const hasStartedAny = allInterviewAttempts.some(attempt => attempt.isStarted);
                            const cvStatus = await checkCvUpload(userJob.user_id);
                            return {
                                ...userJob,
                                interviewStatus: {
                                    hasStartedAny,                              // true if at least one interview was started
                                    hasCompletedAll: completedInterviews === totalInterviews,  // true only if all interviews are completed
                                    completedInterviews,                        // number of completed interviews
                                    totalInterviews,                           // total number of interviews
                                    interviewProgress: `${completedInterviews}/${totalInterviews}` // e.g., "2/3" interviews completed
                                },
                                cvStatus: cvStatus
                            };
                        }
                        return userJob;
                    })
                );

                setLoading(false);
                setCandidates(candidatesWithAttempts);
                setJobTitle(jobDetailsData.job_title || 'Job Title Not Available');

                // Calculate counts
                let started = 0, completed = 0, startedInt = 0, completedInt = 0;
                candidatesWithAttempts.forEach(candidate => {
                    // console.log(candidate);
                    const status = getInterviewStatus(candidate);
                    started++;
                    if (status === "Job Application - Completed") completed++;
                    if (status === "Started interviews") {
                        completed++;
                        startedInt++;
                    }
                    if (status === "Completed interviews") {
                        completedInt++;
                        completed++;
                        startedInt++;
                    }
                });

                setJobApplicationStarted(started);
                setJobApplicationCompleted(completed);
                setStartedInterviews(startedInt);
                setCompletedInterviews(completedInt);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [clientJobId]);

    function getInterviewStatus(candidate) {
        if (candidate.status === "Eligible") {
            return "Job Application - Started";
        }

        if (candidate.status === "Applied" || candidate.status === "CV Matched" || candidate.status === "CV Partially Matched" || candidate.status === "CV Not Matched") {
            if (!candidate.interviewStatus.hasStartedAny) {
                return "Job Application - Completed";
            }

            if (candidate.interviewStatus.hasCompletedAll) {
                return "Completed interviews";
            }
            if (candidate.interviewStatus.hasStartedAny) {
                return "Started interviews";
            }
            return "Job Application - Completed";
        }
        if (candidate.status === "Accepted") {
            if (candidate.interviewStatus.hasCompletedAll) {
                return "Completed interviews";
            }
            if (candidate.interviewStatus.hasStartedAny) {
                return "Started interviews";
            }
            if (!candidate.interviewStatus.hasStartedAny) {
                return "Job Application - Completed";
            }
            return "Job Application - Completed";
        }
        if (candidate.status === "Rejected") {
            if (candidate.interviewStatus.hasCompletedAll) {
                return "Completed interviews";
            }
            if (candidate.interviewStatus.hasStartedAny) {
                return "Started interviews";
            }
            if (!candidate.interviewStatus.hasStartedAny) {
                return "Job Application - Completed";
            }
        }
        return "Unknown Status";
    }

    const handleSendShortlistEmail = async () => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            if (selectedNodes.length === 0) {
                // alert('Please select at least one candidate to shortlist');
                setModalText({
                    title: "Error",
                    bodyText: "Please select at least one candidate to shortlist",
                    buttonText: "OK"
                });
                setShowModal(true);
                return;
            }
            const selectedData = selectedNodes.map(node => node.data);
            console.log('Candidates Batched for Short Listing:', selectedData);
            // preparing a new array with the parameter userId for each to send data to the backend in the required format
            const candidatesBatch = selectedData.map(candidate => {
                return {
                    userId: candidate.user_id,
                };
            });
            console.log('New Array  : Candidates Batched for Short Listing:', candidatesBatch);
            try {
                const response = await fetch(getApiUrl('/api/user-jobs/sendEmail/shortlist'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        job_id: clientJobId,
                        shortlists: candidatesBatch
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    // Refresh the grid
                    // refreshApplicantReports();
                    // alert('Candidates Shortlisted Successfully, Refresh the page to see the changes');  
                    refreshPageData();
                    setModalText({
                        headerText: 'Shortlisting Successful',
                        bodyText: 'The email has been sent to the selected candidates.',
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                } else {
                    // alert('Error Shortlisting Candidates: ' + data.message);  
                    setModalText({
                        title: "Error",
                        bodyText: `Error Shortlisting Candidates: ${data.message}`,
                        buttonText: "OK"
                    });
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error during shortlist request:', error);
                // alert('Error Shortlisting Candidates: ' + error.message);  
                setModalText({
                    title: "Error",
                    bodyText: `Error Shortlisting Candidates: ${error.message}`,
                    buttonText: "OK"
                });
                setShowModal(true);
            }
        } else {
            console.warn('Grid API is not ready yet.');
        }
    };

    const handleSendRejectionEmail = async () => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            if (selectedNodes.length === 0) {
                // alert('Please select at least one candidate to reject');  
                setModalText({
                    title: "Error",
                    bodyText: "Please select at least one candidate to reject",
                    buttonText: "OK"
                });
                setShowModal(true);
                return;
            }
            const selectedData = selectedNodes.map(node => node.data);
            console.log('Candidates Batched for Rejection:', selectedData);
            // preparing a new array with the parameter userId for each to send data to the backend in the required format
            const candidatesBatch = selectedData.map(candidate => {
                return {
                    userId: candidate.user_id,
                };
            });
            console.log('New Array  : Candidates Batched for Rejection:', candidatesBatch);

            try {
                const response = await fetch(getApiUrl('/api/user-jobs/sendEmail/reject'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        job_id: clientJobId,
                        rejects: candidatesBatch
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    // Refresh the grid
                    // refreshApplicantReports();
                    // alert('Candidates Rejected Successfully, Refresh the page to see the changes');  
                    refreshPageData();
                    setModalText({
                        headerText: 'Rejection Successful',
                        bodyText: 'The email has been sent to the rejected candidates.',
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                } else {
                    // alert('Error Rejecting Candidates: ' + data.message);  
                    setModalText({
                        title: "Error",
                        bodyText: `Error Rejecting Candidates: ${data.message}`,
                        buttonText: "OK"
                    });
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error during rejection request:', error);
                // alert('Error Rejecting Candidates: ' + error.message);  
                setModalText({
                    title: "Error",
                    bodyText: `Error Rejecting Candidates: ${error.message}`,
                    buttonText: "OK"
                });
                setShowModal(true);
            }
        } else {
            console.warn('Grid API is not ready yet.');
        }
    };

    const columnDefs = [
        {
            headerName: 'Candidate Name',
            valueGetter: params => `${params.data.firstName} ${params.data.lastName}`,
            cellRenderer: params => {
                // console.log('params', params);
                return (
                    <Link className="candidate-link" to={`/candidate/${params.data.user_id}/job/${params.data.job_id}/cv`}>{params.value}</Link>
                )
            }
        },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Phone', field: 'phoneNumber' },
        { headerName: 'Location', valueGetter: params => `${params.data.city}, ${params.data.state}` },
        { headerName: 'Experience', field: 'experienceLevel' },
        {
            headerName: 'Status',
            valueGetter: params => getInterviewStatus(params.data),
            cellRenderer: params => (
                <div className={`status-badge ${params.value.toLowerCase().replace(/\s+/g, '-')}`}>
                    {params.value}
                </div>
            )
        },
        {
            headerName: 'CV',
            cellRenderer: params => (
                <button
                    className={`poppins-medium ${params.data.cvStatus.uploaded ? 'cv-download-btn' : 'cv-download-btn-disabled'}`}
                    onClick={() => params.data.cvStatus.uploaded && handleCvDownload(params.data.cvStatus.file_url)}
                    disabled={!params.data.cvStatus.uploaded}
                >
                    <PiDownload /> Download CV
                </button>
            ),
            sortable: false,
            filter: false
        }
    ];

    const handleExport = (format) => {
        setDropdownOpen(false);
        if (gridRef.current && gridRef.current.api) {
            switch (format) {
                case 'csv':
                    gridRef.current.api.exportDataAsCsv();
                    break;
                case 'excel':
                    const worksheet = XLSX.utils.json_to_sheet(candidates.map(candidate => ({
                        Name: `${candidate.firstName} ${candidate.lastName}`,
                        Email: candidate.email,
                        Phone: candidate.phoneNumber,
                        Location: `${candidate.city}, ${candidate.state}`,
                        Experience: candidate.experienceLevel,
                        Status: getInterviewStatus(candidate)
                    })));
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
                    XLSX.writeFile(workbook, 'candidates.xlsx');
                    break;
                case 'pdf':
                    const doc = new jsPDF();
                    const tableData = candidates.map(candidate => ([
                        `${candidate.firstName} ${candidate.lastName}`,
                        candidate.email,
                        candidate.phoneNumber,
                        `${candidate.city}, ${candidate.state}`,
                        candidate.experienceLevel,
                        getInterviewStatus(candidate)
                    ]));
                    doc.autoTable({
                        head: [columnDefs.map(col => col.headerName)],
                        body: tableData,
                    });
                    doc.save('candidates.pdf');
                    break;
                default:
                    break;
            }
        }
    };

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <p className="loader-text">Loading candidates, please wait...</p>
            </div>
        );
    }

    return (
        <>
            {
                showModal && (
                    <Modal toggleModal={handleToggleModal} headerText={modalText.headerText} bodyText={modalText.bodyText} buttonText={modalText.buttonText} />
                )
            }
            <div className="candidates-list-container">
                <header className="dashboard-navbar">
                    <div className="poppins-regular">
                        <Link to="/" className="logo" style={{ textDecoration: 'none', marginBottom: '0px', marginTop: '10px' }}>
                            <span className="logo-text"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
                        </Link>
                        <div>
                            <Link to="/client-dashboard" className="job-listings-nav">
                                Job Listings
                            </Link>
                            &gt;{" "}
                            {jobTitle} [All Candidates]
                        </div>
                    </div>
                    <div className="export poppins-medium">
                        <button className="btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <PiExport style={{ fontSize: '20px', color: '#fff623', alignItems: 'center', justifyContent: 'center' }} />
                            Export
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => handleExport('csv')}><PiFileCsv /> CSV</button>
                                <button onClick={() => handleExport('pdf')}><PiFilePdfLight /> PDF</button>
                                <button onClick={() => handleExport('excel')}><PiFileXls /> Excel</button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="dashboard-main">

                    <div className="tag-and-candidates">
                        <div className="poppins-medium tags-container">
                            <span className="tag">Created on: {formatDate(jobData.createdAt)}</span>
                            <button
                                className="reports-btn"
                                onClick={() => navigate(`/client-jobs/${clientJobId}/applicant-reports`)}
                            >
                                View Scores
                            </button>
                            <button onClick={handleSendShortlistEmail} className="shortlist-reject-email-button-candidateList poppins-medium">Send Shortlisting Email</button>
                            <button onClick={handleSendRejectionEmail} className="shortlist-reject-email-button-candidateList poppins-medium">Send Rejection Email</button>
                        </div>
                    </div>
                    <div className="status-boxes">
                        <div className="status-box">
                            <h3>Job Application - Started</h3>
                            <p>{jobApplicationStarted}</p>
                        </div>
                        <div className="status-box">
                            <h3>Job Application - Completed</h3>
                            <p>{jobApplicationCompleted}</p>
                        </div>
                        <div className="status-box">
                            <h3>Started Interviews</h3>
                            <p>{startedInterviews}</p>
                        </div>
                        <div className="status-box">
                            <h3>Completed Interviews</h3>
                            <p>{completedInterviews}</p>
                        </div>
                    </div>

                    <div className="ag-theme-quartz-dark" style={{ height: 'fit-content', width: '100%', marginTop: '10px' }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={candidates}
                            columnDefs={columnDefs}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            domLayout='autoHeight'
                            selection={{
                                mode: 'multiRow',
                                isRowSelectable: (node) => {
                                    const jobStatus = node.data?.status;
                                    return jobStatus !== 'Accepted' && jobStatus !== 'Rejected';
                                }
                            }}
                            getRowStyle={(params) => {
                                const jobStatus = params.data?.status;
                                if (jobStatus === 'Accepted') {
                                    return { backgroundColor: 'rgba(144, 238, 144, 0.4)' }; // Light green with reduced opacity
                                }
                                if (jobStatus === 'Rejected') {
                                    return { backgroundColor: '#5b5b5b' }; // Light red with reduced opacity
                                }
                                return null; // Default styling
                            }}
                            defaultColDef={{
                                sortable: true,
                                filter: true,
                                resizable: true,
                            }}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}
