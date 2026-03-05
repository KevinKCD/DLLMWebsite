import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  DragEvent,
  useEffect,
} from 'react';
import AppModal from '../../../../components/Modal/AppModal';
import './EventModal.css';

interface EventFormValues {
  title?: string;
  date?: string;
  timeStart?: string;
  timeEnd?: string;
  location?: string;
  event?: string;
  capacity?: number | string;
  thumbnailFile?: File | null;
  thumbnailUrl?: string | null;
  time?: string;
  [key: string]: any;
}

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => Promise<void>;
  initialValues?: EventFormValues;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

const MINUTES = ['00', '15', '30', '45'];

const SPORTS = [
  'Football',
  'Basketball',
  'Tennis',
  'Running',
  'Volleyball',
  'Badminton',
  'Other',
];

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues = {},
}) => {
  const [values, setValues] = useState<EventFormValues>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens or editing changes
  useEffect(() => {
    if (!open) return;

    setValues({
      title: initialValues.title || initialValues.activity || '',
      date: initialValues.date || '',
      timeStart: initialValues.timeStart || '',
      timeEnd: initialValues.timeEnd || '',
      location: initialValues.location || '',
      event: initialValues.event || '',
      capacity: initialValues.capacity ?? '',
    });

    setThumbnailFile(null);
    setErrors({});
  }, [open, initialValues]);

  const thumbnailPreviewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : initialValues.thumbnailUrl || null;

  const set = (field: keyof EventFormValues, value: any) =>
    setValues((v) => ({ ...v, [field]: value }));

  const setTimePart = (
    field: 'timeStart' | 'timeEnd',
    part: 'h' | 'm',
    val: string
  ) => {
    setValues((v) => {
      const [h = '', m = ''] = (v[field] as string)?.split(':') || [];
      return {
        ...v,
        [field]: part === 'h' ? `${val}:${m || '00'}` : `${h || '00'}:${val}`,
      };
    });
  };

  const isComplete = (t?: string) => {
    const [h, m] = (t || '').split(':');
    return h !== '' && m !== '';
  };

  const endAfterStart = () => {
    if (!isComplete(values.timeStart) || !isComplete(values.timeEnd))
      return false;
    const [sh, sm] = values.timeStart!.split(':').map(Number);
    const [eh, em] = values.timeEnd!.split(':').map(Number);
    return eh > sh || (eh === sh && em > sm);
  };

  const isValid =
    !!values.title?.trim() &&
    !!values.date &&
    !!values.location?.trim() &&
    !!values.event &&
    Number(values.capacity) > 0 &&
    isComplete(values.timeStart) &&
    isComplete(values.timeEnd) &&
    endAfterStart();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!endAfterStart()) {
      setErrors({ timeEnd: 'End time must be after start time' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await onSubmit({
        ...values,
        thumbnailFile,
        time:
          values.timeStart && values.timeEnd
            ? `${values.timeStart}-${values.timeEnd}`
            : values.timeStart || '',
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
  };

  if (!open) return null;

  return (
    <AppModal open={open} onClose={onClose} maxWidth="580px">
      {/* HEADER */}
      <div className="app-modal-header">
        <h3 className="app-modal-title">
          {initialValues.title ? 'Edit Event' : 'Create Event'}
        </h3>
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
          {/* Thumbnail */}
          <label className="modal-label">Thumbnail</label>

          {thumbnailPreviewUrl ? (
            <div
              className="modal-thumbnail-zone modal-thumbnail-zone--filled"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={thumbnailPreviewUrl}
                alt="Thumbnail preview"
                className="modal-thumbnail-preview"
              />
              <div className="modal-thumbnail-overlay">
                <span className="modal-thumbnail-change-label">
                  Click to change
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`modal-thumbnail-zone${isDragging ? ' modal-thumbnail-zone--dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              aria-label="Upload thumbnail image"
            >
              <div className="modal-thumbnail-empty">
                <div className="modal-thumbnail-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Cloud body */}
                    <path
                      d="M44 28.5c0-6.351-5.149-11.5-11.5-11.5a11.5 11.5 0 0 0-11.27 9.22C17.09 26.98 13 31.4 13 36.75 13 42.42 17.58 47 23.25 47H44a8.5 8.5 0 0 0 0-17z"
                      fill="white"
                      opacity="0.92"
                    />
                    {/* Arrow circle */}
                    <circle
                      cx="32"
                      cy="47"
                      r="11"
                      fill="white"
                      opacity="0.25"
                    />
                    {/* Arrow up */}
                    <path
                      d="M32 43 L32 51 M27.5 46.5 L32 42 L36.5 46.5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="modal-thumbnail-primary">
                  Drag &amp; Drop to Upload File
                </p>
                <p className="modal-thumbnail-or">OR</p>
                <button
                  type="button"
                  className="modal-thumbnail-browse-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse File
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleThumbnailChange}
          />

          {/* Title */}
          <div className="modal-field">
            <label className="modal-label">Event Title</label>
            <input
              className="modal-input"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          {/* Date + Sport */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Date</label>
              <input
                type="date"
                className="modal-input"
                value={values.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Sport</label>
              <select
                className="modal-select"
                value={values.event}
                onChange={(e) => set('event', e.target.value)}
              >
                <option value="">Select sport</option>
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Start Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="modal-select"
                  value={values.timeStart?.split(':')[0] || ''}
                  onChange={(e) =>
                    setTimePart('timeStart', 'h', e.target.value)
                  }
                >
                  <option value="">HH</option>
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <select
                  className="modal-select"
                  value={values.timeStart?.split(':')[1] || ''}
                  onChange={(e) =>
                    setTimePart('timeStart', 'm', e.target.value)
                  }
                >
                  <option value="">MM</option>
                  {MINUTES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">End Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="modal-select"
                  value={values.timeEnd?.split(':')[0] || ''}
                  onChange={(e) => setTimePart('timeEnd', 'h', e.target.value)}
                >
                  <option value="">HH</option>
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <select
                  className="modal-select"
                  value={values.timeEnd?.split(':')[1] || ''}
                  onChange={(e) => setTimePart('timeEnd', 'm', e.target.value)}
                >
                  <option value="">MM</option>
                  {MINUTES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {errors.timeEnd && (
                <div className="modal-error">{errors.timeEnd}</div>
              )}
            </div>
          </div>

          {/* Location + Capacity */}
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Location</label>
              <input
                className="modal-input"
                value={values.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Capacity</label>
              <input
                type="number"
                className="modal-input"
                value={values.capacity}
                onChange={(e) => set('capacity', e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
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
              {submitting
                ? 'Saving...'
                : initialValues.title
                  ? 'Save Changes'
                  : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </AppModal>
  );
};

export default EventModal;
