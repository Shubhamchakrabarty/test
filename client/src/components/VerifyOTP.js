import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './VerifyOTP.css';
import { getApiUrl } from '../utils/apiUtils';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { firstName, phoneNumber, email, smsSent: initialSmsSent, emailSent: initialEmailSent } = location.state || {};
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendVisible, setResendVisible] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(120);
  const [currentSmsSent, setCurrentSmsSent] = useState(false);
  const [currentEmailSent, setCurrentEmailSent] = useState(false);

  // Redirect to login if accessed without necessary state
  useEffect(() => {
    if (!phoneNumber && !email) {
      navigate('/signup');
      return;
    }
    setCurrentSmsSent(initialSmsSent);
    setCurrentEmailSent(initialEmailSent);
  }, [initialSmsSent, initialEmailSent, phoneNumber, email, navigate]);

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
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        navigate('/jobs');
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
        body: JSON.stringify({ phoneNumber, email }),
      });
      const result = await response.json();

      if (response.ok) {
        setCurrentSmsSent(result.smsSent);
        setCurrentEmailSent(result.emailSent);
        setMessage(result.message);
        setResendCount(resendCount + 1);
        setResendVisible(false);
        setTimer(resendCount === 2 ? 1800 : 120);
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
    <div className="verify-otp-container">
      <header className="verify-otp-navbar">
        <Link to="/" className="logo poppins-regular">
          <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
        </Link>
      </header>
      <h2 className="poppins-medium">VERIFY OTP</h2>
      <p className="poppins-regular">{getOTPStatusMessage(currentSmsSent, currentEmailSent)}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="otp"
          className="poppins-medium"
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
              <p className="poppins-regular">Resend available in {timer} seconds</p>
            )}
          </>
        )}
      </form>
      {message && <p className="poppins-regular">{message}</p>}
    </div>
  );
}

export default VerifyOTP;
