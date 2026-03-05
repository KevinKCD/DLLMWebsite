import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from './Components/Header/Header';
import Homepage from './Pages/Homepage/Homepage';
import Videos from './Pages/Videos/Videos';
import Members from './Pages/Members/Members';
import Events from './Pages/Events/Events';
import EventDetails from './Pages/Events/EventDetails';
import Profile from './Pages/Profile/Profile';
import SignUp from './Pages/Auth/SignUp';
import Login from './Pages/Auth/Login';
import Footer from './Components/Footer/Footer';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />

        <main className="main-content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/homepage" replace />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
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
