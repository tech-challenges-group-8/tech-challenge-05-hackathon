import React from 'react';

interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  'aria-describedby'?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 cursor-pointer accent-primary"
        aria-label={label}
        aria-describedby={ariaDescribedBy}
      />
      {label && (
        <label
          htmlFor={id}
          className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export type { CheckboxProps };
