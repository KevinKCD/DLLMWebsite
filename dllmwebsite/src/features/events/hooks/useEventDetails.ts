import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../../../lib/Firebase';
import { uploadToCloudinary } from '../../../services/Cloudinary';
import { Event, Person } from '../../../types';

export interface EventFormData {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  event?: string;
  capacity?: number | string;
  thumbnailFile?: File | null;
  thumbnailUrl?: string | null;
  [key: string]: any;
}

interface UseEventDetailReturn {
  event: Event | null;
  loading: boolean;
  joining: boolean;
  toast: { msg: string; type: 'success' | 'error' } | null;
  people: Person[];
  cap: number;
  joined: number;
  isFull: boolean;
  hasJoined: boolean;
  handleJoinLeave: () => Promise<void>;
  handleUpdateEvent: (data: EventFormData) => Promise<void>;
  handleDelete: () => Promise<void>;
}

export const useEventDetail = (
  eventId: string | undefined,
  user: any
): UseEventDetailReturn => {
  const navigate = useNavigate();
  const userId = user?.uid as string | undefined;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);

  const pushToast = useCallback(
    (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  useEffect(() => {
    if (!eventId) return;
    const unsub = onSnapshot(doc(db, 'events', eventId), (snap) => {
      setEvent(
        snap.exists() ? ({ id: snap.id, ...snap.data() } as Event) : null
      );
      setLoading(false);
    });
    return () => unsub();
  }, [eventId]);

  const people: Person[] = Array.isArray(event?.people) ? event!.people! : [];
  const cap = Number(event?.capacity) || 0;
  const joined = people.length;
  const isFull = joined >= cap && cap > 0;
  const hasJoined = !!userId && people.some((p) => p.uid === userId);

  const handleJoinLeave = async () => {
    if (!eventId || !userId || !event) return;
    setJoining(true);
    try {
      const ref = doc(db, 'events', eventId);
      const personEntry: Person = {
        uid: userId,
        name: user?.displayName || user?.name || 'Member',
        avatar: user?.avatar || user?.photoURL || '',
      };
      if (hasJoined) {
        const existing = people.find((p) => p.uid === userId);
        await updateDoc(ref, { people: arrayRemove(existing ?? personEntry) });
        pushToast('You have left the event.');
      } else if (!isFull) {
        await updateDoc(ref, { people: arrayUnion(personEntry) });
        pushToast('You joined the event!');
      }
    } catch {
      pushToast('Something went wrong.', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!eventId) return;
    try {
      const thumbnailUrl: string | null = data.thumbnailFile
        ? await uploadToCloudinary(data.thumbnailFile, 'event_thumbnails')
        : (data.thumbnailUrl ?? null);
      await updateDoc(doc(db, 'events', eventId), {
        activity: data.title,
        date: data.date,
        time: data.time || '',
        location: data.location,
        event: data.event || '',
        capacity: Number(data.capacity) || 0,
        ...(thumbnailUrl && { thumbnailUrl }),
      });
      pushToast('Event updated');
    } catch {
      pushToast('Failed to update event.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!eventId || !window.confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      navigate('/events');
    } catch {
      pushToast('Failed to delete event.', 'error');
    }
  };

  return {
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
  };
};
