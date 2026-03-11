import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Selecione uma opção',
  helperText,
  error,
  invalid = false,
  'aria-describedby': ariaDescribedBy,
  className = '',
}) => {
  const helperId = helperText && id ? `${id}-helper` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(' ') || undefined;
  const isInvalid = invalid || Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && id && (
        <p id={helperId} className="text-xs text-muted-foreground mt-1">
          {helperText}
        </p>
      )}
      {error && id && (
        <p id={errorId} className="text-xs text-[var(--destructive-default)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export type { SelectProps, Option };
