import React from 'react';
import { motion } from 'framer-motion';
import { getBudgetProgressColor } from '../../utils/budgetUtils.js';

export const BudgetProgress = ({ percentage = 0, height = 'h-2' }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  const barColor = getBudgetProgressColor(percentage);

  return (
    <div className={`w-full bg-[#1F242D] ${height} rounded-full overflow-hidden`}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${safePercentage}%`,
          backgroundColor: barColor,
        }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </div>
  );
};
