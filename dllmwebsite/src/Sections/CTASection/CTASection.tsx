import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CTASection.css';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <h2 className="cta-title">Ready to Join the community?</h2>
      <p className="cta-subtitle">
        Become part of our growing community. Sign up today and never miss an
        event.
      </p>
      <button className="cta-btn" onClick={() => navigate('/signup')}>
        Join Now <span className="cta-arrow">→</span>
      </button>
    </section>
  );
};

export default CTASection;
