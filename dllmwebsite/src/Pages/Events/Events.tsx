import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContext';
import EventCard from './EventCard';
import EventModal from '../../Components/Events/EventsModal/EventModal';
import { db } from '../../Firebase/Firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/Cloudinary';
import './Events.css';
import { Event } from '../../types';

interface EventFormData {
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

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

function Events() {
  const { user } = useAuth();
  const isAdmin = (user as any)?.admin === true;

  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
    },
    []
  );

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );
    const unsub = onSnapshot(
      q,
      async (snap) => {
        const items: Event[] = [];
        const now = Date.now();
        for (const d of snap.docs) {
          const data = d.data();
          const dateStr: string = data.date || '';
          const timeStr: string = data.time || '00:00';
          const dt = new Date(`${dateStr}T${timeStr}`);
          const expireAt = dt.getTime() + 2 * 60 * 60 * 1000;
          if (!isNaN(expireAt) && now > expireAt) {
            try {
              await deleteDoc(doc(db, 'events', d.id));
            } catch {}
            continue;
          }
          items.push({ id: d.id, ...data } as Event);
        }
        setEvents(items);
      },
      (err) => {
        console.error('Firestore error:', err);
        pushToast(err.message, 'error');
      }
    );
    return () => unsub();
  }, [pushToast]);

  const handleAddEvent = async (data: EventFormData): Promise<void> => {
    const tempId = `temp-${Date.now()}`;
    const tempEvent: Event = {
      id: tempId,
      activity: data.title,
      date: data.date,
      time: data.time || '',
      location: data.location,
      event: data.event || '',
      capacity: Number(data.capacity) || 0,
      people: [],
      _temp: true,
      thumbnailUrl: data.thumbnailFile
        ? URL.createObjectURL(data.thumbnailFile)
        : null,
    };
    setEvents((prev) => [tempEvent, ...prev]);

    try {
      let thumbnailUrl: string | null = null;
      if (data.thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(
          data.thumbnailFile,
          'event_thumbnails'
        );
      }

      const payload: Omit<Event, 'id'> & { createdAt: string } = {
        activity: data.title,
        date: data.date,
        time: data.time || '',
        location: data.location,
        event: data.event || '',
        capacity: Number(data.capacity) || 0,
        people: [],
        createdAt: new Date().toISOString(),
        ...(thumbnailUrl && { thumbnailUrl }),
      };

      const docRef = await addDoc(collection(db, 'events'), payload);
      setEvents((prev) =>
        prev.map((e) => (e.id === tempId ? { id: docRef.id, ...payload } : e))
      );
      pushToast('Event created', 'success');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create event:', err);
      setEvents((prev) => prev.filter((e) => e.id !== tempId));
      pushToast('Failed to create event', 'error');
    }
  };

  const handleEditClick = (event: Event): void => {
    setEditing(event);
    setShowModal(true);
  };

  const handleUpdateEvent = async (
    id: string,
    data: EventFormData
  ): Promise<void> => {
    try {
      let thumbnailUrl: string | null = data.thumbnailFile
        ? await uploadToCloudinary(data.thumbnailFile, 'event_thumbnails')
        : (data.thumbnailUrl ?? null);

      const payload: Partial<Event> = {
        activity: data.title,
        date: data.date,
        time: data.time || '',
        location: data.location,
        event: data.event || '',
        capacity: Number(data.capacity) || 0,
        ...(thumbnailUrl && { thumbnailUrl }),
      };

      await updateDoc(doc(db, 'events', id), payload);
      pushToast('Event updated', 'success');
      setEditing(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      pushToast('Failed to update event', 'error');
    }
  };

  const handleDeleteEvent = async (event: Event): Promise<void> => {
    if (!isAdmin || !window.confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', event.id));
      pushToast('Event deleted', 'success');
    } catch (err) {
      pushToast('Failed to delete event', 'error');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Upcoming Events</h2>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            Add Event
          </button>
        )}
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEditClick}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>

      <EventModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSubmit={(values: EventFormData) =>
          editing
            ? handleUpdateEvent(editing.id, values)
            : handleAddEvent(values)
        }
        initialValues={editing ?? {}}
      />

      {/* Toasts */}
      <div
        style={{
          position: 'fixed',
          insetInlineEnd: 16,
          insetBlockStart: 16,
          zIndex: 1060,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show mb-2 ${
              t.type === 'error'
                ? 'text-white bg-danger'
                : t.type === 'success'
                  ? 'text-white bg-success'
                  : 'bg-light text-dark'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="toast-body">{t.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
