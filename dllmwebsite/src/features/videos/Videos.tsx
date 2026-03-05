import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import VideoCard from './components/VideoCard';
import UploadModal from './components/UploadModal';
import { Video, VideoFormValues } from '../../types';

const Videos: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.admin === true;

  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) setVideos(JSON.parse(savedVideos) as Video[]);
  }, []);

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const handleUpload = (videoData: VideoFormValues): void => {
    const newVideo: Video = {
      id: String(Date.now()),
      ...videoData,
      uploadedAt: new Date(),
    };
    setVideos((prev) => [...prev, newVideo]);
  };

  const handleUpdate = (videoId: string, updates: Partial<Video>): void => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
    );
  };

  const handleDelete = (videoId: string): void => {
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

      <UploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
};

export default Videos;
