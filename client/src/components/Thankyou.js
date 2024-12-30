import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css'; 

const ThankYouPage = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
       navigate("/") 
    };

    return (
        <div className="thank-you-container">
            <h1>Thank You!</h1>
            <p>Your interview has been successfully completed.</p>
            <button onClick={handleHomeClick} className="home-button">
                Go to Home
            </button>
        </div>
    );
};

export default ThankYouPage;
