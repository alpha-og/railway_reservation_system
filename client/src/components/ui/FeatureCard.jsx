import React from 'react';
import { motion } from 'motion/react';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
  className = '',
  index = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* Glass Morphism Card using DaisyUI */}
      <div className="card bg-base-100/50 backdrop-blur-xl border border-base-content/10 shadow-2xl h-full">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        {/* Floating Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-4 right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl"
        />
        
        <div className="card-body relative z-10 flex flex-col items-center text-center h-full">
          {/* Icon Container */}
          {Icon && (
            <motion.div 
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
              className="relative mb-6"
            >
              {/* Icon Glow Effect */}
              <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              {/* Icon Background */}
              <div className="relative w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl border border-primary/30">
                <Icon className="w-10 h-10 text-primary-content" />
                
                {/* Sparkle Effects */}
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-base-content rounded-full opacity-80"
                />
                <motion.div
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: 1,
                  }}
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary/60 rounded-full"
                />
              </div>
            </motion.div>
          )}
          
          {/* Title */}
          {title && (
            <motion.h3 
              className="card-title text-2xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300 justify-center"
            >
              {title}
            </motion.h3>
          )}
          
          {/* Description */}
          {description && (
            <motion.p 
              className="text-base-content/80 text-lg leading-relaxed group-hover:text-base-content transition-colors duration-300"
            >
              {description}
            </motion.p>
          )}
          
          {/* Bottom Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '60px' }}
            transition={{ delay: (index * 0.2) + 0.5, duration: 0.8 }}
            className="mt-6 h-1 bg-primary rounded-full"
          />
        </div>
        
        {/* Border Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
      </div>
    </motion.div>
  );
};

export default FeatureCard;