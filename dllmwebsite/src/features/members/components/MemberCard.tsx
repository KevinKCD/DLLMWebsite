import React, { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemberCard.css';
import { UserProfile } from '../../../types';

interface MemberCardProps {
  member: UserProfile;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const navigate = useNavigate();
  const { name, avatar, points = 0, uid, role, admin } = member;
  const memberRole = role || (admin ? 'admin' : 'member');

  const goToProfile = () => {
    if (!uid) return;
    navigate(`/profile/${uid}`);
  };

  const safeRole = (memberRole || 'member')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
  const roleClass = `role-${safeRole}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') goToProfile();
  };

  return (
    <div
      className={`member-card ${roleClass}`}
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={handleKeyDown}
    >
      <div className="member-avatar-wrap">
        <img src={avatar} alt={name} className="member-avatar" />
      </div>
      <div className="member-info">
        <div className="member-top">
          <h5 className="member-name">{name}</h5>
          <span
            className={`member-badge ${memberRole === 'admin' ? 'admin' : 'member'}`}
            aria-label={`role: ${memberRole}`}
          >
            {memberRole
              ? memberRole.charAt(0).toUpperCase() + memberRole.slice(1)
              : 'Member'}
          </span>
        </div>
        <div className="member-points">{points} pts</div>
      </div>
    </div>
  );
};

export default MemberCard;
