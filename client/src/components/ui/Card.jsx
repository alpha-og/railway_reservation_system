import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  shadow = 'xl',
  padding = true,
  className = '',
  ...props 
}) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: 'bg-base-100',
    neutral: 'bg-neutral text-neutral-content',
    primary: 'bg-primary text-primary-content',
    secondary: 'bg-secondary text-secondary-content',
    accent: 'bg-accent text-accent-content',
    ghost: 'bg-base-200'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  
  const finalClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    shadowClasses[shadow],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={finalClasses} {...props}>
      {padding ? (
        <div className="card-body">
          {children}
        </div>
      ) : children}
    </div>
  );
};

// Card Title component for consistency
Card.Title = ({ children, className = '', ...props }) => (
  <h2 className={`card-title ${className}`} {...props}>
    {children}
  </h2>
);

// Card Actions component for consistency
Card.Actions = ({ children, className = '', justify = 'end', ...props }) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center', 
    end: 'justify-end',
    between: 'justify-between'
  };
  
  return (
    <div className={`card-actions ${justifyClasses[justify]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;