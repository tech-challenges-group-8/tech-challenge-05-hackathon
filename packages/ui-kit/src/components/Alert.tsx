import React from 'react';

interface AlertProps {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  closeLabel = 'Close alert',
  className = '',
}) => {
  const typeStyles = {
    info: 'bg-[var(--info-default)]/10 border-[var(--info-default)] text-[var(--info-foreground)]',
    success: 'bg-[var(--success-default)]/10 border-[var(--success-default)] text-[var(--success-foreground)]',
    warning: 'bg-[var(--warning-default)]/10 border-[var(--warning-default)] text-[var(--warning-foreground)]',
    error: 'bg-[var(--destructive-default)]/10 border-[var(--destructive-default)] text-[var(--destructive-foreground)]',
  };

  const iconColors = {
    info: 'text-[var(--info-default)]',
    success: 'text-[var(--success-default)]',
    warning: 'text-[var(--warning-default)]',
    error: 'text-[var(--destructive-default)]',
  };

  return (
    <div
      className={`border rounded-[var(--radius)] p-4 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex gap-3">
        <span className={`text-lg ${iconColors[type]}`} aria-hidden="true">
          {type === 'info' && 'ℹ️'}
          {type === 'success' && '✓'}
          {type === 'warning' && '⚠'}
          {type === 'error' && '✕'}
        </span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label={closeLabel}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export type { AlertProps };
