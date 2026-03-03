import React from 'react';
import './UploadModal.css';
import VideoForm from './VideoForm';

function UploadModal({ show, onClose, onSubmit }) {
  if (!show) return null;

  const initialValues = {
    name: '',
    sport: '',
    location: '',
    date: '',
    youtubeUrl: '',
    description: '',
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card upload-modal">
        <VideoForm
          initialValues={initialValues}
          title="Upload Video"
          submitLabel="Upload"
          onCancel={onClose}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        />
      </div>
    </div>
  );
}

export default UploadModal;
