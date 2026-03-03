import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import VideoForm from './VideoForm';
import { getYouTubeId } from './utils';
import './VideoCard.css';

function VideoCard({ video, onDelete, onUpdate }) {
  const { user } = useAuth();
  const isAdmin = user?.admin === true;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const youtubeId = getYouTubeId(video.youtubeUrl);

  return (
    <div className={`video-card ${showDropdown ? 'show-dropdown' : ''}`}>
      {/* Video */}
      <div className="video-media">
        {youtubeId ? (
          <iframe
            className="video-card-player"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : video.url ? (
          <video src={video.url} controls className="video-card-player" />
        ) : (
          <div className="text-muted text-center py-4">
            No video source available
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="video-card-body">
        <h5 className="fw-bold text-center">{video.name}</h5>
        <div className="video-attributes text-center mt-2">
          {video.sport && (
            <span className={`badge-sport badge-${video.sport.toLowerCase()}`}>
              {video.sport}
            </span>
          )}
          {video.location && <div>Location: {video.location}</div>}
          {video.date && (
            <div>Date: {new Date(video.date).toLocaleDateString()}</div>
          )}
        </div>

        {/* Dropdown for description + admin buttons */}
        {(video.description || isAdmin) && (
          <>
            <div
              className="description-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {showDropdown ? 'Hide Details' : 'Show Details'}
            </div>
            <div className="hidden-content">
              {video.description && (
                <p className="text-center">{video.description}</p>
              )}
              {isAdmin && (
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(video.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card upload-modal">
            <VideoForm
              initialValues={{
                name: video.name,
                description: video.description || '',
                sport: video.sport || '',
                location: video.location || '',
                date: video.date || '',
                youtubeUrl: video.youtubeUrl || '',
              }}
              title="Edit Video"
              submitLabel="Save"
              onCancel={() => setShowEditModal(false)}
              onSubmit={(values) => {
                onUpdate(video.id, values);
                setShowEditModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCard;
