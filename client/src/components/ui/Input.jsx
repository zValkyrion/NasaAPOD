import React from 'react';

const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error, // Mensaje de error a mostrar
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}) => {
  const errorStyle = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-textSecondary mb-1 ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`block w-full px-3 py-2 border ${errorStyle} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${inputClassName} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        aria-invalid={!!error} // Accesibilidad
        aria-describedby={error ? `${id}-error` : undefined} // Accesibilidad
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;