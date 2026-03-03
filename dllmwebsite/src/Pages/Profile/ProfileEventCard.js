import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import EventCard from '../Events/EventCard';
import { useAuth } from '../../Context/AuthContext';

function ProfileEventCard({ eventId, canLeave }) {
  const [event, setEvent] = useState(null);
  const { user, leaveEvent } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      const snap = await getDoc(doc(db, 'events', eventId));
      if (snap.exists()) {
        const data = { id: eventId, ...snap.data() };
        // Only show the event if the current user has joined
        if (data.people?.some((p) => p.uid === user?.uid)) {
          setEvent(data);
        } else {
          setEvent(null);
        }
      }
    };
    fetchEvent();
  }, [eventId, user]);

  if (!event) return null;

  const handleLeave = async () => {
    if (!user) return;
    try {
      await leaveEvent(event.id, 10); // Deduct points
      alert('You have left this event.');
      setEvent(null); // Remove it from profile view
    } catch (err) {
      console.error(err);
      alert('Failed to leave event. Try again.');
    }
  };

  return (
    <EventCard
      event={event}
      hideAdminControls={true}
      leaveEventButton={
        canLeave
          ? {
              onClick: handleLeave,
              label: 'Leave Event',
            }
          : null
      }
    />
  );
}

export default ProfileEventCard;
