import React, { useState, useEffect } from 'react';

function EventForm({
  initialValues = {},
  title = 'Add Event',
  submitLabel = 'Create',
  onCancel,
  onSubmit,
}) {
  const [values, setValues] = useState({
    title: initialValues.title || initialValues.activity || '',
    date: initialValues.date || '',
    timeStart: initialValues.timeStart || '',
    timeEnd: initialValues.timeEnd || '',
    location: initialValues.location || '',
    event: initialValues.event || initialValues.sport || '',
    capacity: initialValues.capacity ?? '',
    thumbnailFile: null,
    thumbnailPreview: initialValues.thumbnail || '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const HOURS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0')
  );
  const MINUTES = ['00', '15', '30', '45'];
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const setTime = (field, part, value) => {
    setValues((v) => {
      const [h = '', m = ''] = v[field]?.split(':') || [];
      return {
        ...v,
        [field]:
          part === 'h' ? `${value}:${m || '00'}` : `${h || '00'}:${value}`,
      };
    });
  };

  const isCompleteTime = (time) => {
    if (!time) return false;
    const [h, m] = time.split(':');
    return h !== '' && m !== '';
  };

  const isEndAfterStart = () => {
    if (!isCompleteTime(values.timeStart) || !isCompleteTime(values.timeEnd))
      return false;
    const [sh, sm] = values.timeStart.split(':').map(Number);
    const [eh, em] = values.timeEnd.split(':').map(Number);
    return eh > sh || (eh === sh && em > sm);
  };

  const isFormValid =
    values.title.trim() &&
    values.date &&
    values.location.trim() &&
    values.event &&
    values.capacity > 0 &&
    isCompleteTime(values.timeStart) &&
    isCompleteTime(values.timeEnd) &&
    isEndAfterStart();

  const validate = () => {
    const err = {};
    if (!isEndAfterStart()) err.timeEnd = 'End time must be after start time';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        time:
          values.timeStart && values.timeEnd
            ? `${values.timeStart}-${values.timeEnd}`
            : values.timeStart || '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValues((v) => ({
      ...v,
      thumbnailFile: file,
      thumbnailPreview: file ? URL.createObjectURL(file) : v.thumbnailPreview,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h4 className="mb-3">{title}</h4>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
        />
      </div>

      <div className="mb-3 row">
        <div className="col">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={values.date}
            onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
          />
        </div>

        <div className="col">
          <label className="form-label">Start time</label>
          <div className="d-flex gap-2">
            <select
              className="form-control"
              value={values.timeStart.split(':')[0] || ''}
              onChange={(e) => setTime('timeStart', 'h', e.target.value)}
            >
              <option value="">HH</option>
              {HOURS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              className="form-control"
              value={values.timeStart.split(':')[1] || ''}
              onChange={(e) => setTime('timeStart', 'm', e.target.value)}
            >
              <option value="">MM</option>
              {MINUTES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col">
          <label className="form-label">End time</label>
          <div className="d-flex gap-2">
            <select
              className="form-control"
              value={values.timeEnd.split(':')[0] || ''}
              onChange={(e) => setTime('timeEnd', 'h', e.target.value)}
            >
              <option value="">HH</option>
              {HOURS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              className="form-control"
              value={values.timeEnd.split(':')[1] || ''}
              onChange={(e) => setTime('timeEnd', 'm', e.target.value)}
            >
              <option value="">MM</option>
              {MINUTES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          {errors.timeEnd && (
            <div className="text-danger small">{errors.timeEnd}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          className="form-control"
          value={values.location}
          onChange={(e) =>
            setValues((v) => ({ ...v, location: e.target.value }))
          }
        />
      </div>

      <div className="mb-3 row">
        <div className="col">
          <label className="form-label">Event</label>
          <select
            className="form-control"
            value={values.event}
            onChange={(e) =>
              setValues((v) => ({ ...v, event: e.target.value }))
            }
          >
            <option value="">Select event</option>
            <option>Football</option>
            <option>Basketball</option>
            <option>Tennis</option>
            <option>Running</option>
            <option>Volleyball</option>
            <option>Other</option>
          </select>
        </div>

        <div className="col">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            className="form-control"
            value={values.capacity}
            onChange={(e) =>
              setValues((v) => ({ ...v, capacity: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="thumbnail" className="form-label fw-semibold">
          Event Thumbnail
        </label>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
        />
        {thumbnailFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(thumbnailFile)}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                borderRadius: '6px',
              }}
            />
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={!isFormValid || submitting}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
