import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { getApiUrl } from '../utils/apiUtils';

const ClientLogin = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        email: ''
    });
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

        const { phoneNumber, email } = formData;

        if (!validatePhoneNumber(phoneNumber)) {
            setMessage('Phone number should be 10 digits long and contain only numbers.');
            return;
        }

        if (!email) {
            setMessage('Email is required.');
            return;
        }

        setLoading(true);

        try {
            console.log('Sending login request:', formData);
            const response = await fetch(getApiUrl('/auth/client/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, email }),
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


            navigate('/client-verify-otp', { state: { phoneNumber, email, emailSent: result.emailSent, smsSent: result.smsSent, ...result.clientUserDetails } });
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
            <div className="login-main-content poppins-regular">
                <h2>LOGIN TO YOUR CLIENT ACCOUNT</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    {loading ? (
                        <div className="loader"></div>
                    ) : (
                        <button type="submit">Send OTP</button>
                    )}
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default ClientLogin;
