import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import './EventCard.css';

function EventCard({
  event,
  onEdit,
  onDelete,
  hideAdminControls = false,
  leaveEventButton,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.admin === true && !hideAdminControls;

  const isPending = Boolean(event?._temp);

  const formatDatePretty = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeRange = () => {
    if (!event?.time) return '';
    const [start, end] = event.time.split('-');

    const format = (t) => {
      if (!t) return '';
      const [h, m] = t.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m || 0));
      return d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      });
    };

    return end ? `${format(start)} – ${format(end)}` : format(start);
  };

  const getBadgeClass = (type) => {
    if (!type) return 'badge-default';
    switch (type.toLowerCase()) {
      case 'badminton':
        return 'badge-badminton';
      case 'football':
        return 'badge-football';
      case 'tennis':
        return 'badge-tennis';
      case 'running':
        return 'badge-running';
      case 'volleyball':
        return 'badge-volleyball';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className={`event-card-relative ${isPending ? 'opacity-75' : ''}`}>
      {/* Thumbnail */}
      {(event.thumbnail || event.thumbnailUrl) && (
        <img
          src={event.thumbnail || event.thumbnailUrl}
          alt={event.activity}
          className="event-thumbnail"
        />
      )}

      {/* Content */}
      <div className="event-card-content">
        <div className="d-flex align-items-center gap-2">
          <h5 className="event-activity mb-0">{event.activity}</h5>
          {isPending && <span className="spinner-border spinner-border-sm" />}
        </div>

        {/* Badge under title */}
        {event.event && (
          <span className={`badge mt-1 ${getBadgeClass(event.event)}`}>
            {event.event}
          </span>
        )}

        <p className="event-date">
          <i className="bi bi-calendar-event me-2" />
          {formatDatePretty(event.date)}
        </p>

        <p className="event-date">
          <i className="bi bi-clock me-2" />
          {formatTimeRange()}
        </p>

        <p className="event-location">
          <i className="bi bi-geo-fill me-2" />
          {event.location}
        </p>

        <p className="event-players">
          <i className="bi bi-people-fill me-2" />
          {event.people?.length ?? 0} / {event.capacity}
        </p>

        {/* Actions */}
        <div className="event-buttons">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/events/${event.id}`)}
            disabled={isPending}
          >
            View Event
          </button>

          {leaveEventButton && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={leaveEventButton.onClick}
            >
              {leaveEventButton.label || 'Leave Event'}
            </button>
          )}

          {isAdmin && (
            <>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onEdit?.(event)}
                disabled={isPending}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
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
}

export default EventCard;
