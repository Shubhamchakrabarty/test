import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, name, phoneNumber } = location.state || {};

  const handleLogout = () => {
    // Perform any logout logic here, such as clearing auth tokens
    navigate('/');
  };

  return (
    <div className="welcome-container">
      <header className="welcome-navbar">
        <Link to="/" className="logo">
         <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
        </Link>
      </header>
      <h2>Welcome to your Pehchaan account, {name}</h2>
      <p>Email: {email}</p>
      <p>Phone Number: {phoneNumber}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Welcome;