import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './VerifyOTP.css';
import { ClientUserContext } from '../context/ClientUserContext';
import { getApiUrl } from '../utils/apiUtils';

const ClientVerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setClientUser } = useContext(ClientUserContext);
    const { phoneNumber, email, smsSent = false, emailSent = false } = location.state || {};
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendVisible, setResendVisible] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [timer, setTimer] = useState(120);
    const [currentSmsSent, setCurrentSmsSent] = useState(smsSent);
    const [currentEmailSent, setCurrentEmailSent] = useState(emailSent);

    // If accessed directly without proper state, redirect to login
    // Redirect if accessed directly without proper state
    useEffect(() => {
        if (!phoneNumber && !email) {
            navigate('/client-login');
        }
    }, [phoneNumber, email, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        if (timer === 0) {
            setResendVisible(true);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const getOTPStatusMessage = (smsSent, emailSent) => {
        console.log('smsSent:', smsSent, 'emailSent:', emailSent); // For debugging

        // Strict equality check for both true case
        if (smsSent === true && emailSent === true) {
            return `Please enter the OTP sent to your number: ${phoneNumber} or your email: ${email}`;
        }
        // Strict equality check for email only case
        else if (smsSent === false && emailSent === true) {
            return `Please enter the OTP sent to your email: ${email}`;
        }
        // Strict equality check for SMS only case
        else if (smsSent === true && emailSent === false) {
            return `Please enter the OTP sent to your number: ${phoneNumber}`;
        }
        // Error case
        return 'It seems like there is an error sending you an OTP. Please try again or wait for 30 mins.';
    };

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/auth/client/verify-otp'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, email, otp }),
            });
            const result = await response.json();
            setMessage(result.message);
            setLoading(false);

            if (response.ok) {
                localStorage.setItem('clientUser', JSON.stringify(result.clientUser));
                setClientUser(result.clientUser);
                navigate('/client-dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error verifying OTP.');
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCount >= 3) {
            setMessage('You have reached the maximum number of resend attempts. Please try again after 30 minutes.');
            return;
        }

        setResendLoading(true);
        try {
            const response = await fetch(getApiUrl('/auth/client/resend-otp'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, email }),
            });
            const result = await response.json();

            if (response.ok) {
                // Update the current SMS and email sent status based on the response
                setCurrentSmsSent(result.smsSent);
                setCurrentEmailSent(result.emailSent);
                setMessage(result.message);
                setResendCount(resendCount + 1);
                setResendVisible(false);
                setTimer(resendCount === 2 ? 1800 : 120); // 30 minutes after 3rd attempt, otherwise 2 minutes
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error resending OTP.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="verify-otp-container poppins-regular">
            <header className="verify-otp-navbar">
                <Link to="/" className="logo poppins-regular">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
            </header>
            <h2>VERIFY OTP</h2>
            <p>{getOTPStatusMessage(currentSmsSent, currentEmailSent)}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleChange}
                    placeholder="OTP"
                    required
                />
                {loading ? (
                    <div className="loader"></div>
                ) : (
                    <>
                        <button type="submit" className="btn">Verify OTP</button>
                        {resendVisible ? (
                            <button onClick={handleResendOTP} disabled={resendLoading} className="btn">
                                {resendLoading ? 'Resending...' : 'Resend OTP'}
                            </button>
                        ) : (
                            <p>Resend available in {timer} seconds</p>
                        )}
                    </>
                )}
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ClientVerifyOTP;