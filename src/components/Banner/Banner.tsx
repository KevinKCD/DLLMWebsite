import React from 'react';
import './Banner.css';

interface BannerProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ title, message, icon }) => {
  return (
    <div className="container">
      <div className="page-banner">
        <div className="page-banner-icon">{icon ?? <span>&#9889;</span>}</div>
        <div className="page-banner-text">
          <h5 className="page-banner-title">{title}</h5>
          <p className="page-banner-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
