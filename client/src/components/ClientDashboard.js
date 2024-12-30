import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import { PiReadCvLogoLight } from "react-icons/pi";
import { FaUsers, FaUserPlus } from "react-icons/fa";


const ClientDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [clientName, setClientName] = useState('Client');
    const [loading, setLoading] = useState(true); // New state for loading
    const [error, setError] = useState(null); // New state for error handling
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(getApiUrl(`/api/client-jobs/client/${clientUser.client_id}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setJobs(data.filter(job => job.status === 'Open'));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        const getClientName = async () => {
            try {
                const response = await fetch(getApiUrl(`/api/clients/${clientUser.client_id}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch client details');
                }
                const data = await response.json();
                console.log(data);
                setClientName(data.name);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchJobs();
        getClientName();
    }, [clientUser.client_id]);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <p className="loader-text">Loading jobs, please wait...</p>
            </div>
        );
    }

    if (error) {
        console.log("Error: ", error);
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>
            <main className="dashboard-main">
                <div className="job-list poppins-regular">
                    <h2>{clientName}'s Job Listings</h2> {/* Replace "Your Job Listings" with client's name */}
                    {jobs.length > 0 ? (
                        <ul>
                            {jobs.map((job) => (
                                <li key={job.id} className='job-item'>
                                    <Link to={`/client-jobs/${job.id}`}>
                                        <div className="job-details">
                                            <span className='title poppins-medium'>{job.job_title}</span>{/* Display only job title */}
                                            <span className='tag poppins-regular'>Created on: {job.createdAt.split('T')[0]}</span> {/* Display created date */}
                                        </div>
                                        <div className="job-actions poppins-regular">
                                            <Link to={`/client-jobs/${job.id}/candidates-list`} className="btn">View Applicants  <FaUsers style={{ fontSize: '20px', color: '#edc500', alignItems: 'center', justifyContent: 'center', marginLeft: '5px' }} /></Link> {/* New button for "Applicant Reports" */}
                                            <Link to={`/invite-user/job/${job.id}`} className="btn">Invite Applicant <FaUserPlus style={{ fontSize: '20px', color: '#edc500', alignItems: 'center', justifyContent: 'center', marginLeft: '5px' }} /></Link> {/* New button for "Applicant Reports" */}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='poppins-regular'>No jobs available. Start by creating a new job listing.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;