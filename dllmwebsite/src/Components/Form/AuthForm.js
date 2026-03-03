import React, { useState } from 'react';
import './AuthForm.css';
function AuthForm({
  title,
  fields,
  submitText,
  loadingText,
  onSubmit,
  footerText,
  footerActionText,
  onFooterClick,
}) {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="fw-bold mb-3">{title}</h2>

        {error && <p className="text-danger">{error}</p>}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                className="form-control"
                placeholder={field.placeholder}
                value={form[field.name] || ''}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={submitting}
          >
            {submitting ? loadingText : submitText}
          </button>
        </form>

        <p className="text-muted mt-3 text-center">
          {footerText}{' '}
          <span
            className="auth-link text-primary"
            style={{ cursor: 'pointer' }}
            onClick={onFooterClick}
          >
            {footerActionText}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
