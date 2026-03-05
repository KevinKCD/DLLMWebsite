import React from 'react';
import './Footer.css';
import logo from '../../assets/images/DLLMWhite.png';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="DLLM Sporting logo" className="footer-logo" />
          <div className="footer-brand-text">
            <span className="footer-title">DLLM Sporting</span>
            <span className="footer-tagline">
              Building community through sports
            </span>
          </div>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} DLLM Sports Community. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
