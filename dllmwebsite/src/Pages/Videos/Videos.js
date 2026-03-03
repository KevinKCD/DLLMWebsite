import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import VideoCard from '../../Components/Video/VideoCard';
import UploadModal from '../../Components/Video/UploadModal';

function Videos() {
  const { user } = useAuth();
  const isAdmin = user?.admin === true;

  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) setVideos(JSON.parse(savedVideos));
  }, []);

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  // Add new video
  const handleUpload = (videoData) => {
    const newVideo = {
      id: Date.now(),
      ...videoData,
      uploadedAt: new Date(),
    };
    setVideos((prev) => [...prev, newVideo]);
  };

  // Update video details
  const handleUpdate = (videoId, updates) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
    );
  };

  // Delete a video
  const handleDelete = (videoId) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  return (
    <div className="videos-page container py-5">
      <h2 className="fw-bold mb-4 text-center">Videos</h2>

      {isAdmin && (
        <div className="text-center mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Upload Video
          </button>
        </div>
      )}

      {videos.length === 0 ? (
        <p className="text-center text-muted">No videos uploaded yet.</p>
      ) : (
        <div className="video-cards-container">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}

export default Videos;
