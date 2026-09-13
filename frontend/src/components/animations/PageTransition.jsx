import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/pageVariants.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

export const PageTransition = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

