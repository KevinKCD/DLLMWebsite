import React from 'react';
import './FeatureCard.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{icon}</div>
      <h5 className="feature-card-title">{title}</h5>
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
