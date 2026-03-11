import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  ariaLabel = 'Breadcrumb',
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-2 ${className}`} aria-label={ariaLabel}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-muted-foreground">/</span>}
          {item.href ? (
            <a
              href={item.href}
              aria-current={index === items.length - 1 ? 'page' : undefined}
              className="text-primary hover:underline transition-cognitive"
            >
              {item.label}
            </a>
          ) : (
            <button
              onClick={item.onClick}
              aria-current={index === items.length - 1 ? 'page' : undefined}
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
