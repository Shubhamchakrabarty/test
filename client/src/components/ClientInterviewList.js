import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import './ClientInterviewList.css';

const InterviewList = () => {
    const { jobId } = useParams();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        fetch(getApiUrl(`/api/client-jobs/${jobId}/interviews`))
            .then(response => response.json())
            .then(data => {
                // Sort interviews by their order
                const sortedInterviews = data.sort((a, b) => a.client_job_interview_order - b.client_job_interview_order);
                setInterviews(sortedInterviews);
            })
            .catch(error => console.error('Error fetching interviews:', error));
    }, [jobId]);

    return (
        <div className="interview-list-client">
            <h2>Interviews for Job ID: {jobId}</h2>
            <div className="interview-card-container">
                {interviews.length > 0 ? (
                    <ul>
                        {interviews.map(interviewItem => (
                            <li key={interviewItem.client_job_interview_id}>
                                <h3>{interviewItem.interview.interview_name}</h3>
                                <p>Time Limit: {interviewItem.interview.interview_time_limit / 60} minutes</p>
                                <p>Time Limit Per Answer: {interviewItem.interview.time_limit_per_answer} seconds</p>
                                <Link to={`/manage-questions/${interviewItem.interview.id}`} className="btn">
                                    Manage Questions
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No interviews available for this job.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewList;
