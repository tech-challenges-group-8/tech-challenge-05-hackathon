import React, { useId, useState } from 'react';

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
  const tabsId = useId();

  const activeIndex = items.findIndex((item) => item.id === activeTab);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (items.length === 0) {
      return;
    }

    let nextIndex = index;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTab(items[nextIndex].id);
    const nextButton = document.getElementById(`${tabsId}-tab-${items[nextIndex].id}`);
    nextButton?.focus();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2 border-b border-border" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`${tabsId}-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`px-4 py-2 font-medium border-b-2 transition-cognitive ${
              activeTab === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`${tabsId}-panel-${item.id}`}
            tabIndex={activeTab === item.id ? 0 : -1}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeIndex >= 0 && (
        <div
          id={`${tabsId}-panel-${items[activeIndex].id}`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${items[activeIndex].id}`}
          tabIndex={0}
        >
          {items[activeIndex].content}
        </div>
      )}
    </div>
  );
};

export type { TabsProps, TabItem };
