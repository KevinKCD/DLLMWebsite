import React from 'react';
import { UsersIcon } from '../../../components/icons';

interface EventJoinSectionProps {
  joined: number;
  cap: number;
  isFull: boolean;
  hasJoined: boolean;
  joining: boolean;
  accentColor: string;
  isLoggedIn: boolean;
  onJoinLeave: () => void;
}

const EventJoinSection: React.FC<EventJoinSectionProps> = ({
  joined,
  cap,
  isFull,
  hasJoined,
  joining,
  accentColor,
  isLoggedIn,
  onJoinLeave,
}) => {
  const pct = cap > 0 ? Math.min((joined / cap) * 100, 100) : 0;

  return (
    <>
      <div className="edp-capacity-row">
        <UsersIcon size={22} />
        <span className="edp-capacity-text">
          <strong>{joined}</strong> / {cap} players joined
        </span>
        {isFull && <span className="edp-full-chip">Full</span>}
      </div>

      <div className="edp-progress">
        <div
          className="edp-progress__bar"
          style={{ width: `${pct}%`, background: accentColor }}
        />
      </div>

      {isLoggedIn && (
        <button
          className={`edp-join-btn ${hasJoined ? 'edp-join-btn--leave' : ''} ${isFull && !hasJoined ? 'edp-join-btn--disabled' : ''}`}
          onClick={onJoinLeave}
          disabled={joining || (isFull && !hasJoined)}
          style={
            !hasJoined && !isFull ? { background: accentColor } : undefined
          }
        >
          {joining
            ? 'Updating…'
            : hasJoined
              ? 'Leave Event'
              : isFull
                ? 'Event Full'
                : 'Join Event'}
        </button>
      )}
    </>
  );
};

export default EventJoinSection;
