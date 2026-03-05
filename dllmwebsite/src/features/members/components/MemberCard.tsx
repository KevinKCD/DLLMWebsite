import React, { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../../types';

interface MemberCardProps {
  member: UserProfile;
}

const getInitials = (name?: string) =>
  (name || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const navigate = useNavigate();
  const { name, avatar, points = 0, uid, role, admin, bio } = member;
  const memberRole = role || (admin ? 'admin' : 'member');
  const isAdmin = memberRole === 'admin';

  const goToProfile = () => {
    if (!uid) return;
    navigate(`/profile/${uid}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') goToProfile();
  };

  return (
    <div
      className="mc-card"
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={handleKeyDown}
    >
      {/* Avatar — overlaps top of card */}
      <div className="mc-avatar-wrap">
        {avatar ? (
          <img src={avatar} alt={name} className="mc-avatar-img" />
        ) : (
          <div className="mc-avatar-initials">{getInitials(name)}</div>
        )}
      </div>

      {/* Body */}
      <div className="mc-body">
        {/* Name */}
        <h5 className="mc-name">{name}</h5>

        {/* Points */}
        <span className="mc-points">{points} pts</span>
        <span className="mc-bio">{bio}</span>

        {/* Role + sport-style pill tags row */}
        <div className="mc-tags">
          <span
            className={`mc-role-tag ${isAdmin ? 'mc-role-tag--admin' : 'mc-role-tag--member'}`}
          >
            {isAdmin ? 'Admin' : 'Member'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
