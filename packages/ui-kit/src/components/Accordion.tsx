import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (allowMultiple) {
        return [...prev, id];
      }
      return [id];
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 flex justify-between items-center bg-background hover:bg-muted transition-cognitive"
            aria-expanded={expandedIds.includes(item.id)}
          >
            <span className="font-medium">{item.title}</span>
            <span
              className={`transform transition-transform ${
                expandedIds.includes(item.id) ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>
          {expandedIds.includes(item.id) && (
            <div className="px-4 py-3 border-t border-border bg-muted/50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export type { AccordionProps, AccordionItem };
