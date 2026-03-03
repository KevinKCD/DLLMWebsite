import React, { useState, useEffect } from 'react';
import { getYouTubeId, sports } from './utils';

function VideoForm({
  initialValues = {},
  title = 'Video',
  submitLabel = 'Save',
  onCancel = () => {},
  onSubmit = () => {},
}) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    sport: initialValues.sport || '',
    location: initialValues.location || '',
    date: initialValues.date || '',
    youtubeUrl: initialValues.youtubeUrl || '',
    description: initialValues.description || '',
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: initialValues.name || '',
      sport: initialValues.sport || '',
      location: initialValues.location || '',
      date: initialValues.date || '',
      youtubeUrl: initialValues.youtubeUrl || '',
      description: initialValues.description || '',
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Title is required';
    if (!formData.sport) newErrors.sport = 'Please select a sport';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.youtubeUrl.trim())
      newErrors.youtubeUrl = 'YouTube URL is required';
    if (formData.youtubeUrl && !getYouTubeId(formData.youtubeUrl))
      newErrors.youtubeUrl = 'Invalid YouTube URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.sport &&
      formData.location.trim() &&
      formData.date &&
      formData.youtubeUrl.trim() &&
      getYouTubeId(formData.youtubeUrl)
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validate()) return;
    onSubmit({
      name: formData.name,
      sport: formData.sport,
      location: formData.location,
      date: formData.date,
      youtubeUrl: formData.youtubeUrl,
      description: formData.description,
    });
  };

  const youtubeId = getYouTubeId(formData.youtubeUrl);

  const showError = (field) =>
    (touched[field] || submitted) && errors[field] ? (
      <div className="invalid-feedback d-block">{errors[field]}</div>
    ) : null;

  return (
    <>
      <h4 className="mb-3">{title}</h4>

      {youtubeId && (
        <div className="mb-3 ratio ratio-16x9">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Video preview"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      <label className="fw-semibold">Title</label>
      <input
        className={`form-control mb-2 ${errors.name ? 'is-invalid' : ''}`}
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      {showError('name')}

      <label className="fw-semibold">Activity</label>
      <div className="d-flex flex-wrap mb-2">
        {sports.map((s) => (
          <span
            key={s}
            className={`badge-sport badge-${s.toLowerCase()}`}
            onClick={() => handleChange('sport', s)}
            style={{
              cursor: 'pointer',
              opacity: formData.sport === s ? 1 : 0.6,
              marginRight: '5px',
              marginBottom: '5px',
            }}
          >
            {s}
          </span>
        ))}
      </div>
      {showError('sport')}

      <label className="fw-semibold">Location</label>
      <input
        className={`form-control mb-2 ${errors.location ? 'is-invalid' : ''}`}
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        onBlur={() => handleBlur('location')}
      />
      {showError('location')}

      <label className="fw-semibold">Date</label>
      <input
        type="date"
        className={`form-control mb-2 ${errors.date ? 'is-invalid' : ''}`}
        value={formData.date}
        onChange={(e) => handleChange('date', e.target.value)}
        onBlur={() => handleBlur('date')}
      />
      {showError('date')}

      <label className="fw-semibold">YouTube URL</label>
      <input
        className={`form-control mb-3 ${errors.youtubeUrl ? 'is-invalid' : ''}`}
        placeholder="https://youtube.com/watch?v=..."
        value={formData.youtubeUrl}
        onChange={(e) => handleChange('youtubeUrl', e.target.value)}
        onBlur={() => handleBlur('youtubeUrl')}
      />
      {showError('youtubeUrl')}

      <label className="fw-semibold">Description</label>
      <textarea
        className="form-control mb-3"
        placeholder="Enter a description for the video"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows={4}
        style={{ resize: 'vertical' }}
      />

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-danger" onClick={onCancel}>
          Cancel
        </button>
        <button
          className={`btn ${isFormValid() ? 'btn-outline-success' : 'btn-dark'}`}
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          {submitLabel}
        </button>
      </div>
    </>
  );
}

export default VideoForm;
