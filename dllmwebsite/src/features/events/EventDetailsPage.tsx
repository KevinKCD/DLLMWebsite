import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEventDetail } from './hooks/useEventDetails';
import { getSportColour } from './eventUtils';
import EventHero from './components/EventHero';
import EventInfoStrip from './components/EventInfoStrip';
import EventJoinSection from './components/EventJoinSection';
import PlayersList from './components/PlayersList/PlayersList';
import EventModal from './components/EventModal/EventModal';
import { ArrowLeftIcon } from '../../components/icons';
import DLLMBlue from '../../assets/images/DLLMBlue.png';
import './EventDetailsPage.css';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = (user as any)?.admin === true;

  const [showModal, setShowModal] = useState(false);

  const {
    event,
    loading,
    joining,
    toast,
    people,
    cap,
    joined,
    isFull,
    hasJoined,
    handleJoinLeave,
    handleUpdateEvent,
    handleDelete,
  } = useEventDetail(eventId, user);

  if (loading) {
    return (
      <div className="edp-loading">
        <div className="edp-spinner" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="edp-not-found">
        <p>Event not found.</p>
        <button className="edp-back-btn" onClick={() => navigate('/events')}>
          <ArrowLeftIcon /> Back to Events
        </button>
      </div>
    );
  }

  const sport = (event.event || event.activity || 'Other') as string;
  const accentColor = getSportColour(sport);

  return (
    <div className="edp-page">
      <EventHero
        thumbnailUrl={event.thumbnailUrl}
        activity={event.activity as string}
        sport={sport}
        accentColor={accentColor}
        isAdmin={isAdmin}
        onBack={() => navigate('/events')}
        onEdit={() => setShowModal(true)}
        onDelete={handleDelete}
      />

      <div className="edp-content">
        <div className="edp-main">
          <div className="edp-title-row">
            <span
              className="edp-sport-badge"
              style={{ background: accentColor }}
            >
              {sport}
            </span>
            <h1 className="edp-title">{event.activity as string}</h1>
          </div>

          <EventInfoStrip
            sport={sport}
            date={event.date as string}
            time={event.time as string}
            location={event.location as string}
            accentColor={accentColor}
          />

          {event.description && (
            <div className="edp-description">
              <h3 className="edp-description__title">About this event</h3>
              <p className="edp-description__text">
                {event.description as string}
              </p>
            </div>
          )}

          <EventJoinSection
            joined={joined}
            cap={cap}
            isFull={isFull}
            hasJoined={hasJoined}
            joining={joining}
            accentColor={accentColor}
            isLoggedIn={!!user}
            onJoinLeave={handleJoinLeave}
          />
        </div>

        <PlayersList people={people} capacity={cap} accentColor={accentColor} />
      </div>

      {isAdmin && (
        <EventModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            await handleUpdateEvent(data);
            setShowModal(false);
          }}
          initialValues={{
            title: event.activity as string,
            date: event.date as string,
            timeStart: event.time?.split('-')[0] || '',
            timeEnd: event.time?.split('-')[1] || '',
            location: event.location as string,
            event: event.event as string,
            capacity: event.capacity as number,
            thumbnailUrl: event.thumbnailUrl as string,
            description: event.description as string,
          }}
        />
      )}

      {toast && (
        <div className={`edp-toast edp-toast--${toast.type}`}>
          <img src={DLLMBlue} alt="logo" className="edp-toast__logo" />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
