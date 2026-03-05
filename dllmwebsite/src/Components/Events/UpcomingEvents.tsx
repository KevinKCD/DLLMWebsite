import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase';
import { AppEvent } from '../../types';
import './UpcomingEvents.css';

// ─── Sport config ─────────────────────────────────────────────────────────────

const SPORT_CONFIG: Record<string, { emoji: string; color: string }> = {
  football: { emoji: '⚽', color: '#22c55e' },
  tennis: { emoji: '🎾', color: '#f97316' },
  basketball: { emoji: '🏀', color: '#ef4444' },
  badminton: { emoji: '🏸', color: '#8b5cf6' },
  volleyball: { emoji: '🏐', color: '#06b6d4' },
  running: { emoji: '🏃', color: '#eab308' },
};

const getSportConfig = (sport?: string) =>
  SPORT_CONFIG[(sport ?? '').toLowerCase()] ?? {
    emoji: '🏅',
    color: '#1a3a8f',
  };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return { day: '--', month: '---' };
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d
      .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      .toUpperCase(),
  };
};

const formatTime = (time?: string) => {
  if (!time) return '';
  const [start, end] = time.split('-');
  const fmt = (t?: string) => {
    if (!t) return '';
    const [h, m] = t.trim().split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m || '0'));
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
};

// ─── Placeholder images per sport ─────────────────────────────────────────────

const SPORT_IMAGES: Record<string, string> = {
  football:
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80',
  tennis:
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
  basketball:
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
  badminton:
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  volleyball:
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
  running:
    'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80',
};

const getSportImage = (event: AppEvent) =>
  event.thumbnailUrl ||
  SPORT_IMAGES[(event.event ?? '').toLowerCase()] ||
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80';

// ─── Component ────────────────────────────────────────────────────────────────

const UpcomingEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          orderBy('date', 'asc'),
          limit(3)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as AppEvent
        );
        setEvents(items);
      } catch (err) {
        console.error('Failed to fetch upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="upcoming-events-section">
      <div className="upcoming-events-header">
        <div>
          <h2 className="upcoming-events-title">Upcoming Events</h2>
          <p className="upcoming-events-subtitle">
            Don't miss out on the action
          </p>
        </div>
        <button
          className="upcoming-events-view-all"
          onClick={() => navigate('/events')}
        >
          View All Events <span className="arrow">→</span>
        </button>
      </div>

      {loading ? (
        <div className="upcoming-events-loading">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="upcoming-events-empty">No upcoming events yet.</div>
      ) : (
        <div className="upcoming-events-grid">
          {events.map((event) => {
            const { day, month } = formatDate(event.date);
            const sport = getSportConfig(event.event);
            const spotsLeft =
              (event.capacity ?? 0) - (event.people?.length ?? 0);
            const joined = event.people?.length ?? 0;

            return (
              <div
                key={event.id}
                className="event-preview-card"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* Image */}
                <div className="event-preview-image-wrap">
                  <img
                    src={getSportImage(event)}
                    alt={event.activity}
                    className="event-preview-image"
                  />
                  {/* Sport badge */}
                  <span
                    className="event-preview-sport-badge"
                    style={{ backgroundColor: sport.color }}
                  >
                    {sport.emoji} {event.event}
                  </span>
                  {/* Date overlay */}
                  <div className="event-preview-date">
                    <span className="event-preview-day">{day}</span>
                    <span className="event-preview-month">{month}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="event-preview-body">
                  <h4 className="event-preview-title">{event.activity}</h4>

                  <div className="event-preview-meta">
                    {event.time && (
                      <span className="event-preview-meta-item">
                        <i className="bi bi-clock" /> {formatTime(event.time)}
                      </span>
                    )}
                    {event.location && (
                      <span className="event-preview-meta-item">
                        <i className="bi bi-geo-alt" /> {event.location}
                      </span>
                    )}
                    <span className="event-preview-meta-item">
                      <i className="bi bi-people" /> {joined} joined •{' '}
                      {spotsLeft} spots left
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
