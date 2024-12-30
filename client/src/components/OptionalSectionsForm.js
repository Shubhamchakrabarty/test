import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css'; // Reuse the same CSS for styling
import signupCircleLarge from '../assets/signup_circle_large.png';
import signupCircleSmall from '../assets/signup_circle_small.png';

const OptionalSectionsForm = () => {
  const navigate = useNavigate();

  const sections = [
    { label: 'Extra Curricular activities', icon: './assets/extra_curriculars.png', route: '/extracurriculars-form' },
    { label: 'Hobbies', icon: './assets/hobbies.png', route: '/hobbies-form' },
    { label: 'Languages', icon: './assets/languages.png', route: '/languages-form' },
    { label: 'Projects', icon: './assets/projects.png', route: '/projects-form' },
    { label: 'References', icon: './assets/references.png', route: '/references-form' },
    { label: 'Custom Details', icon: './assets/custom_details.png', route: '/customsections-form' },
  ];

  return (
    <div className="signup-container">
      <header className="signup-navbar">
        <div className="left">
          <Link to="/" className="logo">
            <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
          </Link>
        </div>
      </header>
      <div className="circle-large">
        <img src={signupCircleLarge} alt="Large Circle" />
      </div>
      <div className="circle-small">
        <img src={signupCircleSmall} alt="Small Circle" />
      </div>
      <div className="greeting-container">
        <img src="./assets/avatar_image.png" alt="Person" className="greeting-image" />
        <div className="greeting-bubble">
          <p>We are almost done!</p>
          <p>You can add more details, but if you want, you can add them later also.</p>
        </div>
      </div>
      <div className="signup-main-content">
        <h2>OPTIONAL SECTIONS</h2>
        <div className="options-grid">
          {sections.map((section, index) => (
            <div key={index} className="option-card" onClick={() => navigate(section.route)}>
              <div className="card-content">
                <img src={section.icon} alt={section.label} className="option-image" />
                <p className="option-text">{section.label}</p>
              </div>  
            </div>
          ))}
        </div>
      </div>
      
      <button className="continue-button" onClick={() => navigate('/final-step')}>Continue</button>
    </div>
  );
};

export default OptionalSectionsForm;