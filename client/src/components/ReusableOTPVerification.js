// Reusable OTP Verification component
// the onVerificationComplete prop can be modified in the parent component to decide
// what to do after OTP verification process is complete
// the handleUserInfoOnOTP prop can be modified in the parent component to handle the user info
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { UserContext } from '../context/UserContext';
import "./ReusableOTPVerification.css"
function OTPVerification({ onVerificationComplete, email, phoneNumber, firstName, handleUserInfoOnOTP, emailSent = false, smsSent = false }) {
    // console.log('in the OTP screen')
    const { setUser } = useContext(UserContext);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendVisible, setResendVisible] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [currentEmailSent, setCurrentEmailSent] = useState(emailSent);
    const [currentSmsSent, setCurrentSmsSent] = useState(smsSent);
    const [timer, setTimer] = useState(120);

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
        if (smsSent && emailSent) {
            return `Hey ${firstName}, please enter the OTP sent to your number: ${phoneNumber} or your email: ${email}`;
        } else if (!smsSent && emailSent) {
            return `Hey ${firstName}, please enter the OTP sent to your email: ${email}`;
        } else if (smsSent && !emailSent) {
            return `Hey ${firstName}, please enter the OTP sent to your number: ${phoneNumber}`;
        }
        return 'It seems like there is an error sending you an OTP. Please try again or wait for 30 mins.';
    };

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        console.log("Inside the handleSubmit for OTP Verification")
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('/auth/verify-otp'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            const result = await response.json();
            setMessage(result.message);
            setLoading(false);

            if (response.ok) {
                // Save user details in local storage
                localStorage.setItem('user', JSON.stringify(result.user));

                // Set user details in context
                setUser(result.user);
                handleUserInfoOnOTP(result.user)
                // Navigate to education form
                onVerificationComplete();
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
            const response = await fetch(getApiUrl('/auth/resend-otp'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });
            const result = await response.json();
            setMessage(result.message);
            setResendLoading(false);

            if (response.ok) {
                setCurrentSmsSent(result.smsSent);
                setCurrentEmailSent(result.emailSent);
                setResendCount(resendCount + 1);
                setResendVisible(false);
                setTimer(resendCount === 2 ? 1800 : 120); // 30 minutes after 3rd attempt, otherwise 2 minutes
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error resending OTP.');
            setResendLoading(false);
        }
    };

    return (
        <div className="verify-otp-container">
            <header className="verify-otp-navbar">
                <Link to="/" className="logo poppins-regular">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
            </header>
            <h2 className='poppins-medium'>VERIFY OTP</h2>
            <p className="poppins-regular">{getOTPStatusMessage(currentSmsSent, currentEmailSent)}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="otp"
                    className='poppins-medium'
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
                            <button onClick={handleResendOTP} disabled={resendLoading} className="btn poppins-regular">
                                {resendLoading ? 'Resending...' : 'Resend OTP'}
                            </button>
                        ) : (
                            <p className='poppins-regular'>Resend available in {timer} seconds</p>
                        )}
                    </>
                )}
            </form>
            {message && <p className='poppins-regular'>{message}</p>}
        </div>
    );
}

export default OTPVerification