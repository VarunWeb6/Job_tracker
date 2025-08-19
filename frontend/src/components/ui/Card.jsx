import React from 'react';

export const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 text-slate-100 shadow-lg ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
