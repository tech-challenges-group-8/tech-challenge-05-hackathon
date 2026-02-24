import React from 'react';

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  className = '',
  orientation = 'horizontal',
  label,
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`w-px h-full bg-border ${className}`} role="separator" />
    );
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return <div className={`h-px bg-border ${className}`} role="separator" />;
};

export type { DividerProps };
