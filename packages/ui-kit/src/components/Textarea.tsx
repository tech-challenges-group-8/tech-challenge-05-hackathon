import React, { useId } from 'react';

interface TextareaProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  helperText?: string;
  error?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 4,
  maxLength,
  helperText,
  error,
  invalid = false,
  'aria-describedby': ariaDescribedBy,
  className = '',
}) => {
  const reactId = useId();
  const textareaId = id ?? `textarea-${reactId}`;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const countId = maxLength ? `${textareaId}-count` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId, countId].filter(Boolean).join(' ') || undefined;
  const isInvalid = invalid || Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      {helperText && (
        <p id={helperId} className="text-xs text-muted-foreground mt-1">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-[var(--destructive-default)] mt-1">
          {error}
        </p>
      )}
      {maxLength && (
        <p id={countId} className="text-xs text-muted-foreground mt-1">
          {value?.length || 0} / {maxLength}
        </p>
      )}
    </div>
  );
};

export type { TextareaProps };
