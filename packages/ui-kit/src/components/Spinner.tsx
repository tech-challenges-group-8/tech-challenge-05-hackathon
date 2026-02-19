import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorStyles = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeStyles[size]} ${colorStyles[color]} border-solid rounded-full animate-spin`}
        role="status"
        aria-label={label || 'Carregando'}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
};

export type { SpinnerProps };
