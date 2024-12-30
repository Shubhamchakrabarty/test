import React, { useState, useEffect } from 'react';
import './SignUp.css';

const Timer = ({ timeLeft }) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            {formatTime(timeLeft)}<span style={{ fontSize:'12px', color:'#666', marginLeft:'5px'}}>sec</span>
        </div>
    );
};

export default Timer;