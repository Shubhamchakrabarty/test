import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import './ManageQuestions.css';

const ManageQuestions = () => {
    const { interviewId } = useParams();
    const [interviewDetails, setInterviewDetails] = useState(null);

    useEffect(() => {
        fetch(getApiUrl(`/api/interviews/${interviewId}/questions`))
            .then(response => response.json())
            .then(data => setInterviewDetails(data))
            .catch(error => console.error('Error fetching interview details:', error));
    }, [interviewId]);

    const handleCreateQuestion = (e) => {
        e.preventDefault();
        // Implement question creation logic here
    };

    if (!interviewDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="manage-questions">
            <h2>Manage Questions for Interview ID: {interviewId}</h2>
            <form onSubmit={handleCreateQuestion}>
                {/* Add form inputs here for creating a new question */}
                <button type="submit" className="btn">Create Question</button>
            </form>
            <div className="question-list">
                <h3>Existing Questions</h3>
                <ul>
                    {interviewDetails.map(question => (
                        <li key={question.id}>
                            <div>
                                <strong>Question {question.question_order}: </strong>
                                {question.question.question_text}
                            </div>
                            <a href={question.question.media_url} target="_blank" rel="noopener noreferrer">View Media</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageQuestions;
