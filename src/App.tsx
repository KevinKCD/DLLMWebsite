import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ScrollToTop from './features/events/components/ScrollToTop';
import Header from './components/Header/Header';
import Homepage from './features/homepage/Homepage';
import Videos from './features/videos/Videos';
import MembersPage from './features/members/MembersPage';
import Events from './features/events/EventsPage';
import EventDetailsPage from './features/events/EventDetailsPage';
import Profile from './features/profiles/Profile';
import SignUp from './features/auth/SignUp';
import Login from './features/auth/Login';
import Footer from './components/Footer/Footer';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <ScrollToTop />
        <Header />

        <main className="main-content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/homepage" replace />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/homepage" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
