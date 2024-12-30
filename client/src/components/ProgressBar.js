import React from 'react';
import './ProgressBar.css'; // Assuming you are styling with CSS

const ProgressBar = ({ currentStep, totalSteps }) => {
    const getStepStatus = (index) => {
        if (index < currentStep) return 'completed';
        if (index === currentStep) return 'active';
        return 'to-do';
    };

    return (
        <div className="progress-container">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`progress-step ${getStepStatus(index)}`}
                />
            ))}
        </div>
    );
};

export default ProgressBar;
