import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        destructive: 'bg-red-100 text-red-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;