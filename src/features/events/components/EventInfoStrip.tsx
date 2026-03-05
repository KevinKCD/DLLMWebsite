import React from 'react';
import {
  CalendarIcon,
  ClockIcon,
  PinIcon,
  SportIcon,
} from '../../../components/icons';
import { formatDate, formatTime } from '../eventUtils';

interface EventInfoStripProps {
  sport: string;
  date?: string;
  time?: string;
  location?: string;
  accentColor: string;
}

const EventInfoStrip: React.FC<EventInfoStripProps> = ({
  sport,
  date,
  time,
  location,
  accentColor,
}) => (
  <div className="edp-info-strip">
    <div className="edp-info-item">
      <span className="edp-info-item__icon" style={{ color: accentColor }}>
        <SportIcon size={22} />
      </span>
      <span className="edp-info-item__value">{sport}</span>
    </div>
    <div className="edp-info-divider" />
    <div className="edp-info-item">
      <span className="edp-info-item__icon" style={{ color: accentColor }}>
        <CalendarIcon size={22} />
      </span>
      <span className="edp-info-item__value">{formatDate(date)}</span>
    </div>
    <div className="edp-info-divider" />
    <div className="edp-info-item">
      <span className="edp-info-item__icon" style={{ color: accentColor }}>
        <ClockIcon size={22} />
      </span>
      <span className="edp-info-item__value">{formatTime(time)}</span>
    </div>
    <div className="edp-info-divider" />
    <div className="edp-info-item">
      <span className="edp-info-item__icon" style={{ color: accentColor }}>
        <PinIcon size={22} />
      </span>
      <span className="edp-info-item__value">{location || '—'}</span>
    </div>
  </div>
);

export default EventInfoStrip;
