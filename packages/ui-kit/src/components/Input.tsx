import React, { useId } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
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
  error?: string;
  helperText?: string;
  invalid?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Base Input Component - UI Kit
 * Styled with Design System Tokens via Tailwind CSS
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
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
  error,
  helperText,
  invalid = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(' ') || undefined;
  const isInvalid = invalid || Boolean(error);

  const baseStyles = [
    'flex h-10 w-full rounded-[var(--radius)]',
    isInvalid ? 'border-[var(--destructive-default)]' : 'border border-[var(--input)]',
    'bg-[var(--background)] text-[var(--foreground)]',
    'px-3 py-2 text-base',
    'placeholder:text-[var(--muted-foreground)]',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-outline-color)] focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--muted-default)]',
    'read-only:bg-[var(--muted-default)]',
  ].join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className={`${baseStyles} ${className}`}
      />
      {helperText && (
        <p id={helperId} className="text-xs text-[var(--muted-foreground)]">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-[var(--destructive-default)]">
          {error}
        </p>
      )}
    </div>
  );
};

export type { InputProps };
