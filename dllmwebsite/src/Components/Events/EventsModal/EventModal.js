import React, { useState } from 'react';
import EventForm from '../EventForm';
import '../../Video/UploadModal.css';

function EventModal({ show, onClose, onSubmit, initialValues = {} }) {
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        pointerEvents: loading ? 'none' : 'auto',
      }}
    >
      <div className="modal-card upload-modal" style={{ position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              inlineSize: '100%',
              blocksize: '100%',
              backgroundColor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: '8px',
            }}
          >
            <div className="spinner-border text-success mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>
              {initialValues?.activity ? 'Saving event…' : 'Creating event…'}
            </div>
          </div>
        )}

        <EventForm
          initialValues={initialValues}
          title={initialValues?.activity ? 'Edit Event' : 'Create Event'}
          submitLabel={initialValues?.activity ? 'Save' : 'Create'}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default EventModal;
