import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Base Input Component - UI Kit
 * Styled with Design System Tokens via Tailwind CSS
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const baseStyles = [
    'flex h-10 w-full rounded-[var(--radius)]',
    'border border-[var(--input)]',
    'bg-[var(--background)] text-[var(--foreground)]',
    'px-3 py-2 text-base',
    'placeholder:text-[var(--muted-foreground)]',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-outline-color)] focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--muted-default)]',
    'read-only:bg-[var(--muted-default)]',
  ].join(' ');

  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseStyles} ${className}`}
    />
  );
};

export type { InputProps };
