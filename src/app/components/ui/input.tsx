// src/components/ui/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can still add custom props if needed
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  className,
  disabled = false,
  ...props // Spread the rest of the props to the <input> element
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor="input" className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed ${disabled ? 'bg-gray-100' : 'bg-white'}`}
        disabled={disabled}
        {...props} // This will spread props like 'required', 'maxLength', etc.
      />
    </div>
  );
};

export default Input;
