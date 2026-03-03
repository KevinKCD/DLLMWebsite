import React from 'react';
import './InfoCard.css';

function InfoCard({ label, value, icon }) {
  return (
    <div
      className="info-card d-flex flex-column align-items-center text-center p-3 mb-2"
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        gap: '6px',
        inlineSize: '150px',
        flex: '1 1 150px',
        maxInlineSize: '220px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}

      <div style={{ fontSize: '0.85rem', color: '#666' }}>{label}</div>

      <div
        style={{
          fontWeight: '600',
          fontSize: '1rem',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default InfoCard;
