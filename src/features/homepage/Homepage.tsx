import React from 'react';
import './Homepage.css';
import logo from '../../assets/images/DLLMWhite.png';
import Banner from '../../components/Banner/Banner';

import UpcomingEvents from '../events/components/UpcomingEvents';
import CTASection from './sections/CTASection/CTASection';
import FeaturesSection from './sections/FeaturesSection/FeaturesSection';
import WelcomeSection from './sections/WelcomeSection/WelcomeSection';

const LOGO_ICON = <img src={logo} alt="DLLM logo" className="banner-logo" />;

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Hero */}
      <WelcomeSection />
      <Banner
        title="Welcome to the DLLM Sporting Community!"
        message="Meet the people who make DLLM great. Connect and play together!"
        icon={LOGO_ICON}
      />
      <FeaturesSection />
      <UpcomingEvents />
      <CTASection />
    </div>
  );
};

export default Homepage;
