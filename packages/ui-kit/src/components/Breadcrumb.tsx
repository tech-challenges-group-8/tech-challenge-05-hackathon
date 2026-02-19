import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-2 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="text-primary hover:underline transition-cognitive"
            >
              {item.label}
            </a>
          ) : (
            <button
              onClick={item.onClick}
              className={`transition-cognitive ${
                index === items.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-primary hover:underline'
              }`}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export type { BreadcrumbProps, BreadcrumbItem };
