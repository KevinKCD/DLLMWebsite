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

function Events() {
  const { user } = useAuth();
  const isAdmin = user?.admin === true;

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );
    const unsub = onSnapshot(
      q,
      async (snap) => {
        const items = [];
        const now = Date.now();
        for (const d of snap.docs) {
          const data = d.data();
          const dateStr = data.date || '';
          const timeStr = data.time || '00:00';
          const dt = new Date(`${dateStr}T${timeStr}`);
          const expireAt = dt.getTime() + 2 * 60 * 60 * 1000;
          if (!isNaN(expireAt) && now > expireAt) {
            try {
              await deleteDoc(doc(db, 'events', d.id));
            } catch {}
            continue;
          }
          items.push({ id: d.id, ...data });
        }
        setEvents(items);
      },
      (err) => pushToast('Failed to load events', 'error')
    );
    return () => unsub();
  }, [pushToast]);

  const handleAddEvent = async (data) => {
    const tempId = `temp-${Date.now()}`;
    const tempEvent = {
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
      let thumbnailUrl = null;
      if (data.thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(
          data.thumbnailFile,
          'event_thumbnails'
        );
      }

      const payload = {
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
  const handleEditClick = (event) => {
    setEditing(event);
    setShowModal(true);
  };
  const handleUpdateEvent = async (id, data) => {
    try {
      let thumbnailUrl = data.thumbnailFile
        ? await uploadToCloudinary(data.thumbnailFile, 'event_thumbnails')
        : data.thumbnailUrl;

      const payload = {
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

  const handleDeleteEvent = async (event) => {
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
        onSubmit={(values) =>
          editing
            ? handleUpdateEvent(editing.id, values)
            : handleAddEvent(values)
        }
        initialValues={editing || {}}
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
            className={`toast show mb-2 ${t.type === 'error' ? 'text-white bg-danger' : t.type === 'success' ? 'text-white bg-success' : 'bg-light text-dark'}`}
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
