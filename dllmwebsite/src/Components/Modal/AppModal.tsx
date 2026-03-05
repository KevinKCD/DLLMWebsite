import React, { useEffect, ReactNode } from 'react';
import './AppModal.css';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  children,
  maxWidth = '600px',
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = '',
}) => {
  // Close on Escape
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose, closeOnEsc]);

  // Prevent body scroll
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="app-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`app-modal-card ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AppModal;
