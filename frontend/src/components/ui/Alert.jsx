import React from 'react';

// This is a "named export" for the parent container
export const Alert = ({ children, className = '' }) => {
    return (
        <div className={`p-4 text-sm rounded-lg ${className}`} role="alert">
            {children}
        </div>
    );
};

// This is a "named export" for the text inside
export const AlertDescription = ({ children, className = '' }) => {
    return <div className={className}>{children}</div>;
};