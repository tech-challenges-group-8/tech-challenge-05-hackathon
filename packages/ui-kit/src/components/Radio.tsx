import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="w-4 h-4 cursor-pointer accent-primary"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export type { RadioProps, RadioOption };
