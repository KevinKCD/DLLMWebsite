import React from 'react';
import './UploadModal.css';
import VideoForm from './VideoForm';

interface VideoFormValues {
  name: string;
  sport: string;
  location: string;
  date: string;
  youtubeUrl: string;
  description: string;
}

interface UploadModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => void | Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  const initialValues: VideoFormValues = {
    name: '',
    sport: '',
    location: '',
    date: '',
    youtubeUrl: '',
    description: '',
  };

  const handleSubmit = async (values: VideoFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card upload-modal">
        <VideoForm
          initialValues={initialValues}
          title="Upload Video"
          submitLabel="Upload"
          onCancel={onClose}
          onSubmit={handleSubmit} // pass the properly typed function
        />
      </div>
    </div>
  );
};

export default UploadModal;
