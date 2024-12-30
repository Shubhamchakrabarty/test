import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import loginCircleLarge from '../assets/signup_circle_large.png';
import loginCircleSmall from '../assets/signup_circle_small.png';
import { getApiUrl } from '../utils/apiUtils';
function Login() {
  const [formData, setFormData] = useState({ phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d{10}$/;
    return re.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setMessage('Phone number should be 10 digits long and contain only numbers.');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending login request:', formData);
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Login response:', result.message);
      setLoading(false);
      if (!response.ok) {
        setMessage(result.message || 'Error sending OTP.');
        console.log('Error Message:', result.message || 'Error sending OTP.');
        return; // Exit the function after setting the message
      }
      console.log('Login response:', result);
      setMessage(result.message); // Set message from response
      // Navigate to VerifyOTP component with state (phoneNumber)
      navigate('/verify-otp', { state: { phoneNumber: formData.phoneNumber, smsSent: result.smsSent, emailSent: result.emailSent, ...result.userDetails } });
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setMessage('Error sending OTP.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-navbar">
        <Link to="/" className="logo poppins-regular">
          <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
        </Link>
      </header>
      <div className="login-main-content">
        <h2 className='poppins-regular'>LOGIN TO YOUR ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="phoneNumber"
            className='phone-number-input poppins-medium'
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          {loading ? (
            <div className="loader"></div>
          ) : (
            <button type="submit" className='poppins-medium'>Log In</button>
          )}
        </form>
        {message && <p>{message}</p>}
      </div>

    </div>
  );
}

export default Login;