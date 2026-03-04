// Homepage.js
import React from 'react';
import './Homepage.css';
import heroImg from '../../Components/Images/Homepage.jpg';

function Homepage() {
  return (
    <div
      className="homepage-hero"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      <div className="homepage-overlay container text-center">
        <h1 className="fw-bold mb-3 text-white">Welcome to DLLM!</h1>
        <button
          className="btn-base btn-lg btn-primary-blue"
          onClick={() => (window.location.href = '/signup')}
        >
          Join Now
        </button>
      </div>
    </div>
  );
}

export default Homepage;
