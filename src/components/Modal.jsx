import React, { useEffect } from 'react';

/*
  Reusable Modal component
  Props:
  - isOpen: boolean
  - onClose: () => void
  - title: string | ReactNode
  - children: ReactNode (modal body)
  - footer: ReactNode (optional footer actions)
  - size: 'sm' | 'md' | 'lg' | 'xl' (optional, default md)
*/

const sizeToClass = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative w-full ${sizeToClass[size] || sizeToClass.md} bg-[var(--color-bg-secondary)] rounded-xl shadow-xl overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex items-center justify-between">
          <div className="text-lg font-medium text-[var(--color-text-primary)]">{title}</div>
          <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" aria-label="Close">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--color-bg-tertiary)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
