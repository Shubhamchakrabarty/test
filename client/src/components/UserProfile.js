import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import EducationUserProfile from './EducationUserProfile';
import InternshipUserProfile from './InternshipUserProfile';
import JobUserProfile from './JobUserProfile';
import ProjectUserProfile from './ProjectUserProfile';
import './SignUp.css'; // Reusing SignUp.css for consistent styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const UserProfile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="signup-container">
      <header className="signup-navbar">
        <div className="left">
          <span className="logo"><span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span></span>
        </div>
      </header>
      <div className="circle-large">
        <img src={signupCircleLarge} alt="Large Circle" />
      </div>
      <div className="circle-small">
        <img src={signupCircleSmall} alt="Small Circle" />
      </div>
      <div className="signup-main-content">
        <h1>{user.firstName}'s Profile</h1>
        <EducationUserProfile />
        <InternshipUserProfile />
        <JobUserProfile />
        <ProjectUserProfile />
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default UserProfile;