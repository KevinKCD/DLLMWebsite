import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MemberCard.css';

function MemberCard({ member }) {
  const navigate = useNavigate();
  const { name, avatar, points, uid, role, admin } = member;
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

  return (
    <div
      className={`member-card ${roleClass}`}
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goToProfile();
      }}
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
        <div className="member-points">{points ?? 0} pts</div>
      </div>
    </div>
  );
}

export default MemberCard;
