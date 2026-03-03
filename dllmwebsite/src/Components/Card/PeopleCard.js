import React from "react";

function PeopleCard({ people = [], capacity = 0, onJoin, onLeave, alreadyJoined, isFull }) {
  const slots = Array.from({ length: capacity });

  return (
    <div className="card shadow-sm p-3">
      <h5 className="fw-bold mb-3 text-center">Players</h5>

      <div className="row g-3">
        {slots.map((_, index) => {
          const person = people[index];

          return (
            <div key={index} className="col-6 col-md-4 col-lg-3">
              <div className="border rounded p-2 text-center h-100 d-flex flex-column align-items-center justify-content-center">

                {person ? (
                  <>
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="rounded-circle mb-2"
                      style={{ inlineSize: "64px", blockSize: "64px", objectFit: "cover" }}
                    />
                    <div className="fw-semibold small">{person.name}</div>

                    {person.uid === (alreadyJoined && people.find(p => p.uid === person.uid)?.uid) && (
                      <button className="btn btn-sm btn-outline-danger mt-2" onClick={onLeave}>
                        Leave
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className="rounded-circle bg-light mb-2 d-flex align-items-center justify-content-center"
                      style={{ inlineSize: "64px", blockSize: "64px", fontSize: "24px" }}
                    >
                      <i className="bi bi-person-plus" />
                    </div>

                    {!alreadyJoined && !isFull && (
                      <button className="btn btn-sm btn-outline-success" onClick={onJoin}>
                        Join
                      </button>
                    )}

                    {(alreadyJoined && !person) && (
                      <span className="text-muted small">Joined</span>
                    )}

                    {isFull && !alreadyJoined && !person && (
                      <span className="text-muted small">Full</span>
                    )}
                  </>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PeopleCard;