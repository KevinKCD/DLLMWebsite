import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { useAuth } from '../../Context/AuthContext';
import InfoCard from '../../Components/Card/InfoCard';
import PeopleCard from '../../Components/Card/PeopleCard';

function EventDetails() {
  const { eventId } = useParams();
  const { user, joinEvent, leaveEvent } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event from Firebase
  useEffect(() => {
    if (!eventId) return setLoading(false);

    const fetchEvent = async () => {
      try {
        const ref = doc(db, 'events', eventId);
        const snap = await getDoc(ref);

        if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
        else setEvent(null);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="text-center mt-5">Loading event…</div>;
  if (!event) return <div className="text-center mt-5">Event not found</div>;

  // Derived data
  const people = Array.isArray(event.people) ? event.people : [];
  const capacity = event.capacity ?? 0;
  const alreadyJoined = people.some((p) => p.uid === user?.uid);
  const isFull = people.length >= capacity;

  const formatTime = (time) => {
    if (!time) return '';
    const [start, end] = time.split('-');
    const format = (t) => {
      const [h, m] = t.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m || '0'));
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };
    return end ? `${format(start)} – ${format(end)}` : format(start);
  };

  const handleJoin = async () => {
    if (!user) return alert('Please log in to join this event.');
    if (alreadyJoined || isFull) return;

    try {
      await joinEvent(event.id, 10);

      // Re-fetch event so people list updates
      const ref = doc(db, 'events', event.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to join event.');
    }
  };
  const handleLeave = async () => {
    if (!user || !alreadyJoined) return;

    try {
      await leaveEvent(event.id, 10);

      // Refresh event
      const ref = doc(db, 'events', event.id);
      const snap = await getDoc(ref);
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
    } catch (err) {
      console.error(err);
      alert('Failed to leave event.');
    }
  };

  const getEventIcon = (type) => {
    if (!type) return <i className="bi bi-tag" />;

    // Add new icons here according to new events
    switch (type.toLowerCase()) {
      case 'football':
        return <i className="fa-regular fa-futbol" />;

      case 'badminton':
        return <i className="fa-solid fa-badminton" />;

      case 'tennis':
        return <i className="fa-solid fa-table-tennis" />;

      case 'running':
        return <i className="fa-solid fa-running" />;

      case 'volleyball':
        return <i className="fa-solid fa-volleyball" />;

      case 'basketball':
        return <i className="fa-solid fa-basketball" />;

      default:
        return <i className="fa-regular fa-futbol" />;
    }
  };
  return (
    <div className="container py-4 d-flex flex-column align-items-center">
      {/* Event Title */}
      <h2 className="fw-bold mb-4 text-center">{event.activity}</h2>

      {/* Thumbnail */}
      {(event.thumbnail || event.thumbnailUrl) && (
        <img
          src={event.thumbnail || event.thumbnailUrl}
          alt={event.activity}
          className="img-fluid mb-4"
          style={{
            blockSize: '350px',
            objectFit: 'cover',
            inlineSize: '100%',
            borderRadius: '10px',
          }}
        />
      )}

      <div className="container mb-4" style={{ inlineSize: '1300px' }}>
        <div className="row g-4">
          {/* LEFT — Info Cards */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <InfoCard
                label="Sport / Activity"
                value={event.event || 'N/A'}
                icon={getEventIcon(event.event)}
              />
              <InfoCard
                label="Date"
                value={event.date}
                icon={<i className="bi bi-calendar-fill" />}
              />
              <InfoCard
                label="Time"
                value={formatTime(event.time)}
                icon={<i className="bi bi-clock-fill" />}
              />
              <InfoCard
                label="Location"
                value={event.location}
                icon={<i className="bi bi-geo-alt-fill" />}
              />
              <InfoCard
                label="Players"
                value={`${people.length} / ${capacity}`}
                icon={<i className="bi bi-people-fill" />}
              />
            </div>
          </div>

          {/* RIGHT — People Card */}
          <div className="col-12 col-lg-4">
            <PeopleCard
              people={people}
              capacity={capacity}
              onJoin={handleJoin}
              onLeave={handleLeave}
              alreadyJoined={alreadyJoined}
              isFull={isFull}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
