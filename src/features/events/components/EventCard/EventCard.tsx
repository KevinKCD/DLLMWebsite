import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { AppEvent } from '../../../../types';
import './EventCard.css';

// ─── Sport config ─────────────────────────────────────────────────────────────

const SPORT_CONFIG: Record<string, { emoji: string; color: string }> = {
  football: { emoji: '⚽', color: '#22c55e' },
  tennis: { emoji: '🎾', color: '#f97316' },
  basketball: { emoji: '🏀', color: '#ef4444' },
  badminton: { emoji: '🏸', color: '#8b5cf6' },
  volleyball: { emoji: '🏐', color: '#06b6d4' },
  running: { emoji: '🏃', color: '#eab308' },
};

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

const getSportConfig = (sport?: string) =>
  SPORT_CONFIG[(sport ?? '').toLowerCase()] ?? {
    emoji: '🏅',
    color: '#1a3a8f',
  };

const getSportImage = (event: AppEvent) =>
  event.thumbnailUrl ||
  SPORT_IMAGES[(event.event ?? '').toLowerCase()] ||
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80';

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeaveEventButton {
  label?: string;
  onClick: () => void;
}

interface EventCardProps {
  event: AppEvent;
  onEdit?: (event: AppEvent) => void;
  onDelete?: (event: AppEvent) => void;
  hideAdminControls?: boolean;
  leaveEventButton?: LeaveEventButton;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  hideAdminControls = false,
  leaveEventButton,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.admin === true && !hideAdminControls;
  const isPending = Boolean(event._temp);
  const sport = getSportConfig(event.event);
  const { day, month } = formatDate(event.date);
  const joined = event.people?.length ?? 0;
  const spotsLeft = (event.capacity ?? 0) - joined;

  return (
    <div className={`event-card ${isPending ? 'event-card--pending' : ''}`}>
      {/* ── Image ── */}
      <div className="event-card-image-wrap">
        <img
          src={getSportImage(event)}
          alt={event.activity}
          className="event-card-image"
        />

        {/* Sport badge */}
        <span
          className="event-card-sport-badge"
          style={{ backgroundColor: sport.color }}
        >
          {sport.emoji} {event.event}
        </span>

        {/* Date overlay */}
        <div className="event-card-date">
          <span className="event-card-date-day">{day}</span>
          <span className="event-card-date-month">{month}</span>
        </div>

        {/* Pending spinner */}
        {isPending && (
          <div className="event-card-pending-overlay">
            <span className="spinner-border spinner-border-sm text-white" />
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="event-card-body">
        <h4 className="event-card-title">{event.activity}</h4>

        <div className="event-card-meta">
          {event.time && (
            <span className="event-card-meta-item">
              <i className="bi bi-clock" /> {formatTime(event.time)}
            </span>
          )}
          {event.location && (
            <span className="event-card-meta-item">
              <i className="bi bi-geo-alt" /> {event.location}
            </span>
          )}
          <span className="event-card-meta-item">
            <i className="bi bi-people" /> {joined} joined · {spotsLeft} spots
            left
          </span>
        </div>

        {/* ── Actions ── */}
        <div className="event-card-actions">
          {leaveEventButton && (
            <button
              className="event-card-btn event-card-btn--danger-outline"
              onClick={leaveEventButton.onClick}
            >
              {leaveEventButton.label ?? 'Leave Event'}
            </button>
          )}

          {isAdmin && (
            <>
              <button
                className="event-card-btn event-card-btn--outline"
                onClick={() => onEdit?.(event)}
                disabled={isPending}
              >
                Edit
              </button>
              <button
                className="event-card-btn event-card-btn--danger"
                onClick={() => onDelete?.(event)}
                disabled={isPending}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
