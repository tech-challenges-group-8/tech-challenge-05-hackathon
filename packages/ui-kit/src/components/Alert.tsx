import React from 'react';

interface AlertProps {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  className = '',
}) => {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="mt-2 text-sm font-medium hover:underline"
          aria-label="Fechar alerta"
        >
          Fechar
        </button>
      )}
    </div>
  );
};

export type { AlertProps };
