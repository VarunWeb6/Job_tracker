import React from 'react';

const Input = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input'; // Helps in React DevTools
export default Input;