import React, { useState, ChangeEvent, FormEvent } from 'react';
import './AuthForm.css';

// EXPORT THIS
export interface AuthField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
}

interface AuthFormProps<T extends Record<string, string>> {
  title: string;
  fields: AuthField[];
  submitText: string;
  loadingText: string;
  onSubmit: (form: T) => Promise<void>;
  footerText?: string;
  footerActionText?: string;
  onFooterClick?: () => void;
}

function AuthForm<T extends Record<string, string>>({
  title,
  fields,
  submitText,
  loadingText,
  onSubmit,
  footerText = '',
  footerActionText = '',
  onFooterClick,
}: AuthFormProps<T>) {
  const [form, setForm] = useState<T>({} as T);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
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

        {footerText && (
          <p className="text-muted mt-3 text-center">
            {footerText}{' '}
            {footerActionText && onFooterClick && (
              <span
                className="auth-link text-primary"
                style={{ cursor: 'pointer' }}
                onClick={onFooterClick}
              >
                {footerActionText}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
