import React from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon } from '../../../components/icons';

interface EventHeroProps {
  thumbnailUrl?: string | null;
  activity?: string;
  sport: string;
  accentColor: string;
  isAdmin: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EventHero: React.FC<EventHeroProps> = ({
  thumbnailUrl,
  activity,
  sport,
  accentColor,
  isAdmin,
  onBack,
  onEdit,
  onDelete,
}) => (
  <div className="edp-hero-wrapper">
    <div
      className="edp-hero"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={activity} className="edp-hero__img" />
      ) : (
        <div
          className="edp-hero__placeholder"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, #0f172a)`,
          }}
        >
          <span className="edp-hero__sport-bg">{sport}</span>
        </div>
      )}
      <div className="edp-hero__overlay" />

      <button className="edp-back-btn" onClick={onBack}>
        <ArrowLeftIcon /> Back
      </button>

      {isAdmin && (
        <div className="edp-hero__admin">
          <button className="edp-admin-btn" onClick={onEdit}>
            <EditIcon size={16} /> Edit
          </button>
          <button
            className="edp-admin-btn edp-admin-btn--danger"
            onClick={onDelete}
          >
            <TrashIcon size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  </div>
);

export default EventHero;
