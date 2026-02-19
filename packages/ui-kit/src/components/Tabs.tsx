import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2 border-b border-border">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 font-medium border-b-2 transition-cognitive ${
              activeTab === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            aria-selected={activeTab === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>
        {items.find((item) => item.id === activeTab)?.content}
      </div>
    </div>
  );
};

export type { TabsProps, TabItem };
