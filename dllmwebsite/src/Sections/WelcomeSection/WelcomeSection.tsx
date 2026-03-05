import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeSection.css';
import heroImg from '../../Components/Images/Homepage.jpg';

const WelcomeSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="welcome-section"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <div className="welcome-overlay container text-center">
        <h1 className="fw-bold mb-3 text-white">Welcome to DLLM!</h1>
        <button
          className="btn-base btn-lg btn-primary-blue"
          onClick={() => navigate('/signup')}
        >
          Join Now
        </button>
      </div>
    </section>
  );
};

export default WelcomeSection;
