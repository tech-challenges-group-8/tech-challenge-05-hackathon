import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = 'rounded-lg transition-cognitive';

  const variantStyles = {
    default: 'bg-background border border-border p-4',
    elevated: 'bg-background rounded-lg shadow-lg p-4',
    outlined: 'bg-background border-2 border-primary p-4',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export type { CardProps };
