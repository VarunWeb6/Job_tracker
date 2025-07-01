import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
            <div className="relative z-50 w-full max-w-lg">{children}</div>
        </div>
    );
};

export const DialogContent = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>{children}</div>
);

export const DialogHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-2 ${className}`}>{children}</div>
);

export const DialogTitle = ({ children, className = '' }) => (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
);