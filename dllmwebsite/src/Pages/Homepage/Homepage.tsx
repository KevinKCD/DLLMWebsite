import React from 'react';
import './Homepage.css';
import logo from '../../Components/Images/DLLMWhite.png';
import Banner from '../../Components/Banner/Banner';

import UpcomingEvents from '../../Components/Events/UpcomingEvents';
import CTASection from '../../Sections/CTASection/CTASection';
import FeaturesSection from '../../Sections/FeaturesSection/FeaturesSection';
import WelcomeSection from '../../Sections/WelcomeSection/WelcomeSection';

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
