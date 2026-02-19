import React from 'react';

interface TextareaProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
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
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      {maxLength && (
        <p className="text-xs text-muted-foreground mt-1">
          {value?.length || 0} / {maxLength}
        </p>
      )}
    </div>
  );
};

export type { TextareaProps };
