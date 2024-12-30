import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import './JobApplicantReports.css';
import { ClientUserContext } from '../context/ClientUserContext';
import { AgGridReact } from 'ag-grid-react';
import { AgChartsReact } from 'ag-charts-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { PiFileXls } from "react-icons/pi";
import { PiFileCsv } from "react-icons/pi";
import { PiFilePdfLight } from "react-icons/pi";
import { PiExport } from "react-icons/pi";
//import { calculatePercentile } from '../utils/mathUtils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaRegFilePdf } from "react-icons/fa6";
import { BsArrowRepeat, BsFileEarmarkExcel } from "react-icons/bs";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";
import Modal from './Modal';

const JobApplicantReports = () => {
    const { clientJobId } = useParams();
    const { clientUser } = useContext(ClientUserContext);
    const [applicantReports, setApplicantReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(); // Store job name
    const [jobName, setJobName] = useState('');
    const [evaluationCriteriaMap, setEvaluationCriteriaMap] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [weightages, setWeightages] = useState({});
    const [showWeightageTable, setShowWeightageTable] = useState(false);
    const [tempWeightages, setTempWeightages] = useState({ ...weightages });
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState({
        headerText: '',
        bodyText: '',
        buttonText: ''
    });

    function toggleModal() {
        setShowModal(!showModal);
    }

    const gridRef = useRef(null);  // Reference for accessing the grid API
    //const chartContainerRef = useRef(null); // Reference for chart container

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const fetchApplicantReports = async () => {
            try {
                const jobDetailsResponse = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}`));
                const jobDetailsData = await jobDetailsResponse.json();
                setJobName(jobDetailsData.job_title);
                setJob(jobDetailsData);

                const response = await fetch(getApiUrl(`/api/scores/client-jobs/${clientJobId}/candidate-scores`));
                const data = await response.json();
                console.log('data:', data); // Debug log

                if (!data || !data.report || data.report.length === 0) {
                    setApplicantReports([]);
                    setLoading(false);
                    return;
                }
                // data.report also has the latest attempt details , we need to sort candidates based on the latest attempt, latest attempt can be null as well 
                // so we need to handle that as well
                data.report.sort((a, b) => {
                    if (a.latest_attempt && b.latest_attempt) {
                        return new Date(a.latest_attempt) > new Date(b.latest_attempt) ? -1 :
                            new Date(a.latest_attempt) < new Date(b.latest_attempt) ? 1 : 0;
                    } else if (a.latest_attempt) {
                        return -1;
                    } else if (b.latest_attempt) {
                        return 1;
                    }
                    return 0;
                });
                // console.log('sorted data:', sortedReport); // Debug log
                setApplicantReports(data.report);

                // Create a map of evaluation criteria for each interview
                const criteriaMap = {};
                data.report.forEach(applicant => {
                    Object.keys(applicant.interviews).forEach(interviewName => {
                        if (!criteriaMap[interviewName]) {
                            criteriaMap[interviewName] = new Set();
                        }
                        const interviewScores = applicant.interviews[interviewName];
                        Object.keys(interviewScores).forEach(criteria => {
                            criteriaMap[interviewName].add(criteria);
                        });
                    });
                });

                const finalCriteriaMap = {};
                Object.keys(criteriaMap).forEach(interview => {
                    finalCriteriaMap[interview] = Array.from(criteriaMap[interview]);
                });
                setEvaluationCriteriaMap(finalCriteriaMap);

                // Load weightages from localStorage if available, otherwise initialize with default values
                const savedWeightages = JSON.parse(localStorage.getItem(`weightages_${clientJobId}`)) || {};
                const initialWeightages = {};
                Object.keys(finalCriteriaMap).forEach(interviewName => {
                    initialWeightages[interviewName] = {};
                    finalCriteriaMap[interviewName].forEach(criteria => {
                        initialWeightages[interviewName][criteria] = savedWeightages[interviewName]?.[criteria] ?? 1;
                    });
                });
                setWeightages(initialWeightages);
                setTempWeightages(initialWeightages);

            } catch (error) {
                console.error('Error fetching applicant reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicantReports();
    }, [clientJobId]);

    const refreshApplicantReports = async () => {
        setRefreshing(true)
        try {
            const response = await fetch(getApiUrl(`/api/scores/client-jobs/${clientJobId}/candidate-scores`));
            const data = await response.json();
            data.report.sort((a, b) => {
                if (a.latest_attempt && b.latest_attempt) {
                    return new Date(a.latest_attempt) > new Date(b.latest_attempt) ? -1 :
                        new Date(a.latest_attempt) < new Date(b.latest_attempt) ? 1 : 0;
                } else if (a.latest_attempt) {
                    return -1;
                } else if (b.latest_attempt) {
                    return 1;
                }
                return 0;
            });
            if (!data || !data.report || data.report.length === 0) {
                setApplicantReports([]);
                return;
            }
            setApplicantReports(data.report);

        } catch (error) {
            console.error('Error refreshing applicant reports:', error);
        } finally {
            setRefreshing(false)
        }
    };

    const handleSendShortlistEmail = async () => {
        if (gridRef.current && gridRef.current.api) {
            const selectedNodes = gridRef.current.api.getSelectedNodes();
            if (selectedNodes.length === 0) {
                setModalText({
                    headerText: 'Error',
                    bodyText: 'Please select at least one candidate to shortlist',
                    buttonText: 'Okay'
                });
                setShowModal(true);
                return;
            }
            const selectedData = selectedNodes.map(node => node.data);
            console.log('Candidates Batched for Short Listing:', selectedData);

            try {
                const response = await fetch(getApiUrl('/api/user-jobs/sendEmail/shortlist'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        job_id: clientJobId,
                        shortlists: selectedData
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    // Refresh the grid
                    refreshApplicantReports();
                    // alert('Candidates Shortlisted Successfully');
                    setModalText({
                        headerText: 'Shortlisting Successful',
                        bodyText: 'The email has been sent to the selected candidates.',
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                } else {
                    // alert('Error Shortlisting Candidates: ' + data.message); 
                    setModalText({
                        headerText: 'Error Shortlisting Candidates',
                        bodyText: 'Error Shortlisting Candidates: ' + data.message,
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error during shortlist request:', error);
                // alert('Error Shortlisting Candidates: ' + error.message);  
                setModalText({
                    headerText: 'Error Sending Email',
                    bodyText: 'Error Shortlisting Candidates: ' + error.message,
                    buttonText: 'Okay'
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
                    headerText: 'Error',
                    bodyText: 'Please select at least one candidate to reject',
                    buttonText: 'Okay'
                });
                setShowModal(true);
                return;
            }
            const selectedData = selectedNodes.map(node => node.data);
            console.log('Candidates Batched for Rejection:', selectedData);

            try {
                const response = await fetch(getApiUrl('/api/user-jobs/sendEmail/reject'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        job_id: clientJobId,
                        rejects: selectedData
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    // Refresh the grid
                    refreshApplicantReports();
                    // alert('Candidates Rejected Successfully'); 
                    setModalText({
                        headerText: 'Rejection Successful',
                        bodyText: 'The email has been sent to the rejected candidates.',
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                } else {
                    // alert('Error Rejecting Candidates: ' + error.message); 
                    setModalText({
                        headerText: 'Error Rejecting Candidates',
                        bodyText: 'Error Rejecting Candidates: ',
                        buttonText: 'Okay'
                    });
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error during rejection request:', error);
                // alert('Error Rejecting Candidates: ' + error.message); 
                setModalText({
                    headerText: 'Error Rejecting Candidates',
                    bodyText: 'Error Rejecting Candidates: ' + error.message,
                    buttonText: 'Okay'
                });
                setShowModal(true);
            }
        } else {
            console.warn('Grid API is not ready yet.');
        }
    };

    const handleWeightageChange = (interviewName, criteria, value) => {
        if (value === '' || isNaN(value)) {
            setTempWeightages((prev) => ({
                ...prev,
                [interviewName]: {
                    ...prev[interviewName],
                    [criteria]: value,
                }
            }));
        } else {
            const numericValue = parseFloat(value);
            setTempWeightages((prev) => ({
                ...prev,
                [interviewName]: {
                    ...prev[interviewName],
                    [criteria]: numericValue,
                }
            }));

            setWeightages((prev) => ({
                ...prev,
                [interviewName]: {
                    ...prev[interviewName],
                    [criteria]: numericValue,
                }
            }));
        }
    };

    const saveWeightages = () => {
        localStorage.setItem(`weightages_${clientJobId}`, JSON.stringify(tempWeightages));
        setWeightages(tempWeightages);
        alert('Weightages saved successfully!');
    };

    const downloadExcel = () => {
        const wsData = [];

        const headers = ['Candidate', 'Total Score']; // Add the Total Score header
        Object.keys(evaluationCriteriaMap).forEach(interviewName => {
            evaluationCriteriaMap[interviewName].forEach(criteria => {
                headers.push(`${interviewName} - ${criteria}`);
            });
        });
        wsData.push(headers);

        applicantReports.forEach(applicant => {
            const row = [applicant.userName];
            let totalWeightedScore = 0; // Total weighted score

            Object.keys(evaluationCriteriaMap).forEach(interviewName => {
                evaluationCriteriaMap[interviewName].forEach(criteria => {
                    const score = parseFloat(applicant.interviews[interviewName]?.[criteria] ?? 0);
                    const weightage = weightages[interviewName]?.[criteria] ?? 1;
                    const weightedScore = score * weightage;
                    row.push(score.toFixed(1));
                    if (!isNaN(weightedScore)) {
                        totalWeightedScore += weightedScore;
                    }
                });
            });

            row.splice(1, 0, totalWeightedScore.toFixed(1));
            wsData.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reports');

        XLSX.writeFile(wb, `ApplicantReports_${jobName}.xlsx`);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['Candidate', 'Total Score'];
        const tableRows = [];

        Object.keys(evaluationCriteriaMap).forEach(interviewName => {
            evaluationCriteriaMap[interviewName].forEach(criteria => {
                tableColumn.push(`${interviewName} - ${criteria}`);
            });
        });

        applicantReports.forEach(applicant => {
            const rowData = [applicant.userName];
            let totalScore = 0;

            Object.keys(evaluationCriteriaMap).forEach(interviewName => {
                evaluationCriteriaMap[interviewName].forEach(criteria => {
                    const score = parseFloat(applicant.interviews[interviewName]?.[criteria] ?? 0);
                    const weightage = weightages[interviewName]?.[criteria] ?? 1;
                    const weightedScore = score * weightage;
                    rowData.push(score.toFixed(1));
                    if (!isNaN(weightedScore)) {
                        totalScore += weightedScore;
                    }
                });
            });

            rowData.splice(1, 0, totalScore.toFixed(1)); // Insert total score after the candidate name
            tableRows.push(rowData);
        });

        doc.text(`Applicant Reports: ${jobName}`, 14, 16);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
        doc.save(`ApplicantReports_${jobName}.pdf`);
    };

    // Generate columns based on the evaluation criteria, without additional API calls
    const generateColumns = () => {
        let hasCheatingCriteria = false;

        // Optimized loop to check for "cheating" criteria
        for (const interviewName of Object.keys(evaluationCriteriaMap)) {
            for (const criteria of evaluationCriteriaMap[interviewName]) {
                if (criteria.toLowerCase().includes('cheating')) {
                    console.log('CheatingCriteria: ', criteria); // Debug log
                    hasCheatingCriteria = true;
                    break; // Exit inner loop
                }
            }
            if (hasCheatingCriteria) break; // Exit outer loop
        }

        console.log('hasCheatingCriteria: ', hasCheatingCriteria); // Debug log

        const columns = [
            {
                headerName: 'Candidate',
                field: 'userName',
                cellRenderer: (params) => {
                    console.log('params.data:', params.data); // Debug log
                    return (
                        <Link
                            className="candidate-link"
                            to={`/jobs/all-scores/${clientJobId}/${params.data.userId}?candidateName=${encodeURIComponent(params.data.userName)}`}
                        >
                            {params.data.userName}
                        </Link>
                    );
                },
                sortable: true,
                filter: true,
            },
        ];

        // Conditionally add the "Cheating Risk" column
        if (hasCheatingCriteria) {
            columns.push({
                headerName: 'Cheating Risk',
                field: 'cheatingRisk', // Use the calculated `cheatingRisk` field
                cellRenderer: (params) => {
                    const cheatingRisk = params.value || 'No Cheating';
                    let style = {};

                    // Determine styles based on risk level
                    if (cheatingRisk === 'No Cheating') {
                        style = { color: 'green', fontWeight: 'bold' };
                    } else if (cheatingRisk === 'Moderate Risk') {
                        style = { color: 'orange', fontWeight: 'bold' };
                    } else if (cheatingRisk === 'High Risk') {
                        style = { color: 'red', fontWeight: 'bold' };
                    }

                    return <span style={style}>{cheatingRisk}</span>;
                },
                sortable: true,
                filter: 'agTextColumnFilter', // Allow filtering by "Cheating Risk"
            });
        }

        // Add a Total Score column that sums up all relevant numeric columns
        columns.push({
            headerName: 'Total Score',
            field: 'totalScore',
            valueGetter: (params) => {
                let totalScore = 0;
                Object.keys(evaluationCriteriaMap).forEach(interviewName => {
                    evaluationCriteriaMap[interviewName]
                    .filter((criteria) => !criteria.toLowerCase().includes('cheating')) // Exclude cheating criteria
                    .filter((criteria) => !criteria.toLowerCase().includes('typing speed')) // Exclude typing speed criteria
                    .forEach(criteria => {
                        const score = parseFloat(params.data[`${interviewName}_${criteria}`] ?? 0);
                        const weightage = weightages[interviewName]?.[criteria];
                        console.log(weightage);
                        if (weightage > 0 && !isNaN(score)) {
                            totalScore += score * weightage;
                        }

                    });
                });
                return parseFloat(totalScore.toFixed(1));
            },
            type: 'numericColumn',
            sortable: true,
            filter: 'agNumberColumnFilter',
        });


        Object.keys(evaluationCriteriaMap).forEach((interviewName) => {
            const interviewColumns = evaluationCriteriaMap[interviewName]
            .filter((criteria) => !criteria.toLowerCase().includes('cheating'))
            .map((criteria) => ({
                headerName: criteria,
                field: `${interviewName}_${criteria}`, // Now directly access the prepared rowData fields
                sortable: true,
                filter: 'agNumberColumnFilter',
                type: 'numericColumn',
                valueGetter: (params) => {
                    const value = parseFloat(params.data[`${interviewName}_${criteria}`]);
                    return !isNaN(value) ? parseFloat(value.toFixed(1)) : parseFloat('0.0'); // Restrict to 1 decimal place
                },
            }));

            columns.push({
                headerName: interviewName,
                children: interviewColumns, // Group the criteria columns under each interview name
            });
        });

        // push the latest attempt date , if latest_attempt is null -> then show 'All Interviews not attempted'
        columns.push({
            headerName: 'Latest Attempt',
            field: 'latest_attempt',
            sortable: true,
            filter: 'agDateColumnFilter',
        });

        // show the user job status, if Accepted or Rejected, dont allow to select the row 
        columns.push({
            headerName: 'Job Status',
            field: 'job_status',
            sortable: true,
            filter: true,
        });
        return columns;
    };

    const rowData = applicantReports.map((applicant) => {
        const row = { userName: applicant.userName, userId: applicant.userId };
        let hasHighRisk = false;
        let allNoCheating = true;
        let cheatingFlagsFound = false;

        // Map each interview and criterion to a unique field in the row
        Object.keys(applicant.interviews).forEach((interviewName) => {
            Object.keys(applicant.interviews[interviewName]).forEach((criteria) => {
                const score = parseFloat(applicant.interviews[interviewName][criteria] || 0);
                if (criteria.toLowerCase().includes('cheating')){
                    cheatingFlagsFound = true; // Mark that cheating data exists
                    // Process cheating flags to determine risk level
                    if (score > 1.33) hasHighRisk = true;
                    if (score >= 0.75) allNoCheating = false; // Not "No Cheating" if any flag >= 0.75
                } else {
                    // Non-cheating criteria: add to row data
                    row[`${interviewName}_${criteria}`] = score;
                }
                
            });
        });

        // Add aggregated cheating risk to the row
        if (!cheatingFlagsFound) {
            row.cheatingRisk = 'No Cheating'; // Default to "No Cheating" if no flags are found
        } else if (hasHighRisk) {
            row.cheatingRisk = 'High Risk';
        } else if (allNoCheating) {
            row.cheatingRisk = 'No Cheating';
        } else {
            row.cheatingRisk = 'Moderate Risk';
        }

        row.latest_attempt = applicant.latest_attempt ? formatDate(applicant.latest_attempt) : 'N.A';
        row.job_status = applicant.userJobStatus;
        return row;
    });

    const exportToCsv = () => {
        if (gridRef.current && gridRef.current.api) {
            gridRef.current.api.exportDataAsCsv();
        } else {
            console.warn('Grid API is not ready yet.');
        }
    };
    /*
    // Create Chart Options (Bar chart as an example)
    const chartOptions = {
        data: rowData.map(row => ({ userName: row.userName, totalScore: parseFloat(row.totalScore) })),
        series: [
            {
                type: 'bar',
                xKey: 'userName',
                yKey: 'totalScore',
                yName: 'Total Score',
            },
        ],
        legend: {
            enabled: true,
        },
        axes: [
            {
                type: 'category',
                position: 'bottom',
                label: {
                    rotation: -45
                }
            },
            {
                type: 'number',
                position: 'left'
            }
        ]
    };
    */

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleWeightageTable = () => {
        setShowWeightageTable(prevShow => !prevShow);
    };

    const handleExport = (format) => {
        setDropdownOpen(false);
        switch (format) {
            case 'csv':
                exportToCsv();
                break;
            case 'pdf':
                downloadPDF();
                break;
            case 'excel':
                downloadExcel();
                break;
            default:
                break;
        }
    };
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <p className="loader-text">Loading applicant reports, please wait...</p>
            </div>
        );
    }

    if (applicantReports.length === 0) {
        return <p>No applicants or no data found for this job.</p>;
    }

    const candidateCount = rowData.length;
    console.log('candidateCount:', candidateCount);



    return (
        <>
            {showModal && (
                <Modal toggleModal={toggleModal} headerText={modalText.headerText} bodyText={modalText.bodyText} buttonText={modalText.buttonText} />
            )}
            <div className="applicant-reports-container historical-scores-container">
                <header className="dashboard-navbar">
                    <div className="poppins-regular">
                        <div>
                            <Link to="/" className="logo" style={{ textDecoration: 'none', marginBottom: '0px', marginTop: '10px' }}>
                                <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
                            </Link>
                        </div>
                        <div>
                            <Link to="/client-dashboard" className="job-listings-nav">
                                Job Listings
                            </Link>
                            &gt;{" "}
                            <Link to={`/client-jobs/${clientJobId}/candidates-list`} className="job-listings-nav">
                                {job.job_title} [All Candidates]
                            </Link>
                            &gt;{" "}
                            Scores
                        </div>

                    </div>
                    <div className='export poppins-medium'>
                        <button className="btn" onClick={toggleDropdown}>
                            <PiExport style={{ fontSize: '20px', color: '#fff623', alignItems: 'center', justifyContent: 'center' }} />
                            Export
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => handleExport('csv')}><PiFileCsv style={{ fontSize: '20px', color: '#fff623', alignItems: 'center', justifyContent: 'center' }} /> CSV</button>
                                <button onClick={() => handleExport('pdf')}> <PiFilePdfLight style={{ fontSize: '20px', color: '#fff623', alignItems: 'center', justifyContent: 'center' }} /> PDF</button>
                                <button onClick={() => handleExport('excel')}><PiFileXls style={{ fontSize: '20px', color: '#fff623', alignItems: 'center', justifyContent: 'center' }} /> Excel</button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="dashboard-main">
                    <div className='tag-and-candidates'>
                        <div className='poppins-medium' style={{ display: 'flex' }}>
                            <span className='tag'>Created on: {formatDate(job.createdAt)}</span> {/* Display created date */}
                            <button className='change-weightage-button poppins-medium' onClick={toggleWeightageTable}>Change Weightage</button>
                            <button className="refresh-button poppins-medium" onClick={refreshApplicantReports}>
                                {refreshing ? (
                                    <BsArrowRepeat className='spinner-icon' style={{ fontSize: '20px', marginRight: '8px' }} />
                                ) : (
                                    <BsArrowRepeat style={{ fontSize: '20px', marginRight: '8px' }} />
                                )}
                                <div>
                                    {refreshing ? 'Refreshing...' : 'Refresh Scores'}
                                </div>
                            </button>
                            <button onClick={handleSendShortlistEmail} className="shortlist-reject-email-button poppins-medium">Send Shortlisting Email</button>
                            <button onClick={handleSendRejectionEmail} className="shortlist-reject-email-button poppins-medium">Send Rejection Email</button>
                        </div>
                        <div className='candidates poppins-regular'>
                            <h3>Total Candidates Attempted: {candidateCount}</h3>
                        </div>
                    </div>
                    <div className="ag-theme-quartz-dark poppins-medium" style={{ height: 'fit-content', width: '100%', marginTop: '10px' }}>
                        <AgGridReact
                            ref={gridRef}  // Attach the grid reference
                            rowData={rowData}
                            columnDefs={generateColumns()}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            domLayout="autoHeight"
                            selection={{
                                mode: 'multiRow',
                                isRowSelectable: (node) => {
                                    const jobStatus = node.data?.job_status;
                                    return jobStatus !== 'Accepted' && jobStatus !== 'Rejected';
                                }
                            }}
                            getRowStyle={(params) => {
                                const jobStatus = params.data?.job_status;
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
                                type: 'numericColumn',
                            }}
                        />
                    </div>
                    <div>
                        {showWeightageTable && (
                            <div>
                                <table className="reports-table poppins-medium">
                                    <thead>
                                        <tr>
                                            <th>Interview</th>
                                            <th>Criteria</th>
                                            <th>Weightage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(evaluationCriteriaMap).map(interviewName => (
                                            evaluationCriteriaMap[interviewName].map(criteria => (
                                                <tr key={`${interviewName}-${criteria}`}>
                                                    <td>{interviewName}</td>
                                                    <td>{criteria}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            value={weightages[interviewName][criteria]}
                                                            onChange={(e) => handleWeightageChange(interviewName, criteria, e.target.value)}
                                                            defaultValue="1"
                                                            min="0"
                                                            step="0.1"
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={saveWeightages} className='save-weightage-btn poppins-medium' style={{ marginTop: '10px' }}>Save Weightages</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default JobApplicantReports;
