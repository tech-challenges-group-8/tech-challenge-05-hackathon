import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
      >
        <div className="p-6">
          <h2 id="dialog-title" className="text-lg font-semibold mb-4">
            {title}
          </h2>
          <div className="mb-6">{children}</div>
          {actions && <div className="flex gap-2 justify-end">{actions}</div>}
        </div>
      </div>
    </>
  );
};

export type { DialogProps };
