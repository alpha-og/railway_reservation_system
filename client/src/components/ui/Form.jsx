import React from 'react';

// Base Input component with variants
const Input = ({ 
  error,
  className = '',
  variant = 'bordered',
  size = 'md',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'input w-full';
  
  const variantClasses = {
    bordered: 'input-bordered',
    ghost: 'input-ghost',
    primary: 'input-primary',
    secondary: 'input-secondary',
    accent: 'input-accent',
    error: 'input-error',
    warning: 'input-warning',
    success: 'input-success'
  };
  
  const sizeClasses = {
    xs: 'input-xs',
    sm: 'input-sm', 
    md: '',
    lg: 'input-lg'
  };
  
  const inputClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.bordered,
    sizeClasses[size],
    error ? variantClasses.error : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <input 
      className={inputClasses}
      disabled={disabled}
      {...props}
    />
  );
};

// Base Select component with variants
const Select = ({ 
  options = [],
  placeholder,
  loading = false,
  error,
  className = '',
  variant = 'bordered',
  size = 'md',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'select w-full';
  
  const variantClasses = {
    bordered: 'select-bordered',
    ghost: 'select-ghost',
    primary: 'select-primary',
    secondary: 'select-secondary',
    accent: 'select-accent',
    error: 'select-error',
    warning: 'select-warning',
    success: 'select-success'
  };
  
  const sizeClasses = {
    xs: 'select-xs',
    sm: 'select-sm',
    md: '',
    lg: 'select-lg'
  };
  
  const selectClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.bordered,
    sizeClasses[size],
    error ? variantClasses.error : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <select 
      className={selectClasses}
      disabled={loading || disabled}
      {...props}
    >
      <option value="">{loading ? "Loading..." : placeholder}</option>
      {!loading && options?.map((option) => (
        <option 
          key={option.id || option.value} 
          value={option.id || option.value}
          disabled={option.disabled}
        >
          {option.name || option.label || option.text}
        </option>
      ))}
    </select>
  );
};

// Helper function to safely render error messages
const getErrorMessage = (error) => {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error.message) return error.message;
  return 'Invalid input';
};

// FormField wrapper component for consistent form layout
const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className = '',
  ...props 
}) => {
  const errorMessage = getErrorMessage(error);
  
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      {children}
      {errorMessage && (
        <p className="label-text-alt text-error">{errorMessage}</p>
      )}
    </div>
  );
};

// Pre-composed components for common patterns
const FormInput = ({ 
  label, 
  error, 
  required = false,
  register,
  name,
  ...inputProps 
}) => {
  const registerProps = register ? register(name) : {};
  
  return (
    <FormField label={label} error={error} required={required}>
      <Input 
        error={!!error}
        {...registerProps}
        {...inputProps}
      />
    </FormField>
  );
};

const FormSelect = ({ 
  label, 
  error, 
  required = false,
  register,
  name,
  options,
  placeholder,
  loading,
  ...selectProps 
}) => {
  const registerProps = register ? register(name) : {};
  
  return (
    <FormField label={label} error={error} required={required}>
      <Select 
        options={options}
        placeholder={placeholder}
        loading={loading}
        error={!!error}
        {...registerProps}
        {...selectProps}
      />
    </FormField>
  );
};

export { Input, Select, FormField, FormInput, FormSelect };