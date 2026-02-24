import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Base Button Component - UI Kit
 * Styled with Design System Tokens via Tailwind CSS
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-medium rounded-[var(--radius)]',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-outline-color)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ');

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const variantStyles = {
    primary: [
      'bg-[var(--primary-default)] text-[var(--primary-foreground)]',
      'hover:bg-[var(--primary-dark)]',
    ].join(' '),
    secondary: [
      'bg-[var(--secondary-default)] text-[var(--secondary-foreground)]',
      'hover:opacity-80',
    ].join(' '),
    destructive: [
      'bg-[var(--destructive-default)] text-[var(--destructive-foreground)]',
      'hover:bg-[var(--destructive-dark)]',
    ].join(' '),
    ghost: [
      'bg-transparent text-[var(--foreground)]',
      'hover:bg-[var(--muted-default)]',
    ].join(' '),
    outline: [
      'bg-transparent border border-[var(--border)]',
      'text-[var(--foreground)]',
      'hover:bg-[var(--muted-default)]',
    ].join(' '),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export type { ButtonProps };
