import React from 'react';
import { Person } from '../../../../types';
import './PlayersList.css';

interface PlayersListProps {
  people: Person[];
  capacity: number;
  accentColor?: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const PlayersList: React.FC<PlayersListProps> = ({
  people,
  capacity,
  accentColor = '#e76f51',
}) => {
  return (
    <aside className="players-list">
      <div className="players-list__header">
        <h2 className="players-list__title">Players</h2>
        <span className="players-list__count">
          {people.length} / {capacity} players
        </span>
      </div>

      {people.length === 0 ? (
        <p className="players-list__empty">No players yet. Be the first!</p>
      ) : (
        <div className="players-list__grid">
          {people.map((person, i) => (
            <div key={person.uid} className="players-list__player">
              <div
                className="players-list__avatar-ring"
                style={{ borderColor: accentColor }}
              >
                {person.avatar ? (
                  <img
                    src={person.avatar}
                    alt={person.name || 'Player'}
                    className="players-list__avatar-img"
                  />
                ) : (
                  <div
                    className="players-list__avatar-initials"
                    style={{ background: `hsl(${(i * 67) % 360}, 55%, 52%)` }}
                  >
                    {getInitials(person.name || `P${i + 1}`)}
                  </div>
                )}
              </div>
              <span className="players-list__name">
                {person.name || `Player ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default PlayersList;
