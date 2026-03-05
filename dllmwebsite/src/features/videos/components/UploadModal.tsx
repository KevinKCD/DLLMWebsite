import React, { useState, FormEvent } from 'react';
import AppModal from '../../../components/Modal/AppModal';

interface VideoFormValues {
  name: string;
  sport: string;
  location: string;
  date: string;
  youtubeUrl: string;
  description: string;
}

interface UploadModalProps {
  open: boolean; // ✅ renamed
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => void | Promise<void>;
}

const SPORTS = [
  'Football',
  'Basketball',
  'Tennis',
  'Running',
  'Volleyball',
  'Badminton',
  'Other',
];

const EMPTY: VideoFormValues = {
  name: '',
  sport: '',
  location: '',
  date: '',
  youtubeUrl: '',
  description: '',
};

const UploadModal: React.FC<UploadModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<VideoFormValues>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof VideoFormValues, value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const isValid =
    !!values.name.trim() && !!values.sport && !!values.youtubeUrl.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(EMPTY);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AppModal open={open} onClose={onClose} maxWidth="580px">
      {/* ✅ HEADER NOW CONTROLLED HERE */}
      <div className="app-modal-header">
        <h3 className="app-modal-title">Upload Video</h3>
        <button
          className="app-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="app-modal-body">
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">Video Title</label>
            <input
              className="modal-input"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Sunday League Highlights"
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Sport</label>
              <select
                className="modal-select"
                value={values.sport}
                onChange={(e) => set('sport', e.target.value)}
              >
                <option value="">Select sport</option>
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Date</label>
              <input
                type="date"
                className="modal-input"
                value={values.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Location</label>
            <input
              className="modal-input"
              value={values.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Bow School"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">YouTube URL</label>
            <input
              className="modal-input"
              value={values.youtubeUrl}
              onChange={(e) => set('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Description</label>
            <textarea
              className="modal-input"
              rows={3}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of the video..."
              style={{ resize: 'none' }}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={!isValid || submitting}
            >
              {submitting ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
};

export default UploadModal;
