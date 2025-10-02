import React from 'react';
import Card from './Card';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
  variant = 'neutral',
  iconSize = 'md',
  className = '',
  ...props 
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
    xl: 'w-10 h-10 sm:w-12 sm:h-12'
  };
  
  const iconContainerSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-20 h-20 sm:w-24 sm:h-24'
  };
  
  return (
    <Card 
      variant={variant}
      shadow="lg"
      className={`p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center text-center">
        {Icon && (
          <div className={`${iconContainerSizes[iconSize]} rounded-full bg-primary flex items-center justify-center mb-4 sm:mb-6`}>
            <Icon className={`${iconSizes[iconSize]} text-primary-content`} />
          </div>
        )}
        {title && (
          <Card.Title className="text-base sm:text-lg font-semibold mb-2">
            {title}
          </Card.Title>
        )}
        {description && (
          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default FeatureCard;