// src/components/ui/Input.tsx

import React from 'react';

interface InputProps {
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  className,
  disabled = false,
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
      />
    </div>
  );
};

export default Input;
