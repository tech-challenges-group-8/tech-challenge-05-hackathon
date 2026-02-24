import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[var(--primary-default)] text-[var(--primary-foreground)]',
    secondary: 'bg-[var(--secondary-default)] text-[var(--secondary-foreground)]',
    success: 'bg-[var(--success-default)] text-[var(--success-foreground)]',
    warning: 'bg-[var(--warning-default)] text-[var(--warning-foreground)]',
    error: 'bg-[var(--destructive-default)] text-[var(--destructive-foreground)]',
    outline: 'bg-transparent border border-[var(--border)] text-[var(--foreground)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {label}
    </span>
  );
};

export type { BadgeProps };
