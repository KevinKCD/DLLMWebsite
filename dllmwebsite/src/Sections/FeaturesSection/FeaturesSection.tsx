import React from 'react';
import FeatureCard from '../../Components/Card/FeatureCard';
import {
  BsCalendar2,
  BsPeopleFill,
  BsLightningFill,
  BsHeartPulseFill,
} from 'react-icons/bs';
import './FeaturesSection.css';

const CalendarIcon = BsCalendar2 as React.ElementType;
const PeopleIcon = BsPeopleFill as React.ElementType;
const BoltIcon = BsLightningFill as React.ElementType;
const HeartIcon = BsHeartPulseFill as React.ElementType;

const FEATURES = [
  {
    icon: <CalendarIcon />,
    title: 'Regular Events',
    description: 'Weekly games and tournaments for all skill levels.',
  },
  {
    icon: <PeopleIcon />,
    title: 'Community',
    description: 'Connect with passionate sports enthusiasts.',
  },
  {
    icon: <BoltIcon />,
    title: 'Compete',
    description: 'Challenge yourself in friendly competitions.',
  },
  {
    icon: <HeartIcon />,
    title: 'Stay Active',
    description: 'Keep fit while having fun with friends.',
  },
];

const FeaturesSection: React.FC = () => (
  <section className="features-section text-center">
    <div className="container">
      <h2 className="fw-bold mb-3">Why Join DLLM?</h2>
      <p className="lead mb-5">
        More than just a sports group — we're a community that keeps you active
        and connected.
      </p>
      <div className="features-grid">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.title}
            icon={f.icon}
            title={f.title}
            description={f.description}
          />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
