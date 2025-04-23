import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true, ...props }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const MotionWrapper = animate ? motion.div : 'div';

  return (
    <MotionWrapper
      className={`bg-surface rounded-lg shadow-md overflow-hidden ${className}`}
      variants={animate ? cardVariants : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
};

export default Card;