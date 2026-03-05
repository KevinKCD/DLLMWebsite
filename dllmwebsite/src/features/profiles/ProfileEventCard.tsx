import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/Firebase';
import { useNavigate } from 'react-router-dom';
import EventCard from '../events/components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';
import { AppEvent } from '../../types';

interface ProfileEventCardProps {
  eventId: string;
  canLeave: boolean;
}

const ProfileEventCard: React.FC<ProfileEventCardProps> = ({
  eventId,
  canLeave,
}) => {
  const [event, setEvent] = useState<AppEvent | null>(null);
  const { user, leaveEvent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async (): Promise<void> => {
      try {
        const snap = await getDoc(doc(db, 'events', eventId));
        if (!snap.exists()) return;

        const data: AppEvent = {
          id: eventId,
          ...(snap.data() as Omit<AppEvent, 'id'>),
        };

        if (data.people?.some((p) => p.uid === user?.uid)) {
          setEvent(data);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  if (!event) return null;

  const handleLeave = async (): Promise<void> => {
    if (!user) return;
    try {
      await leaveEvent(event.id, 10);
      alert('You have left this event.');
      setEvent(null);
    } catch (err) {
      console.error(err);
      alert('Failed to leave event. Try again.');
    }
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <EventCard
        event={event}
        hideAdminControls={true}
        leaveEventButton={
          canLeave ? { onClick: handleLeave, label: 'Leave Event' } : undefined
        }
      />
    </div>
  );
};

export default ProfileEventCard;
