import React from 'react';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <select
            className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${className}`}
            ref={ref}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = 'Select';
export default Select;