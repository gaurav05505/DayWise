import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { BudgetProgress } from './BudgetProgress.jsx';
import { formatCurrency, getBudgetIcon } from '../../utils/budgetUtils.js';

export const CustomBudgetCard = ({ budget, onSelect, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const name = budget.name || '';
  const totalBudget = budget.amount ?? budget.totalBudget ?? 0;
  const totalSpent = budget.spent ?? budget.totalSpent ?? 0;
  const remaining = budget.remaining !== undefined ? budget.remaining : (totalBudget - totalSpent);
  const percentage = budget.percentageUsed !== undefined ? budget.percentageUsed : (budget.percentage !== undefined ? budget.percentage : (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0));
  const isOverBudget = budget.isOverBudget !== undefined ? budget.isOverBudget : (totalSpent > totalBudget);

  const iconInfo = getBudgetIcon(name);
  const IconComponent = iconInfo.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect?.(budget)}
      className="w-full bg-[#14161B] hover:bg-[#1B1E26] border border-white/[0.04] rounded-[24px] p-4 transition-colors cursor-pointer group relative shadow-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${iconInfo.color}18`, color: iconInfo.color }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-[15px] leading-snug group-hover:text-[#55F130] transition-colors">
              {name}
            </h3>
            {budget.description ? (
              <p className="text-[#8A92A0] text-[11px] line-clamp-1">{budget.description}</p>
            ) : (
              <p className="text-[#8A92A0] text-[11px]">
                Budget: {formatCurrency(totalBudget)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-9 w-32 bg-[#1B1E26] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-30"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit?.(budget);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-[#F3F4F6] hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#55F130]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete?.(budget);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-[#EF4444] hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <BudgetProgress percentage={percentage} height="h-2" />

        <div className="flex items-center justify-between text-xs pt-1">
          <div>
            <span className="text-[#8A92A0] text-[11px]">Spent </span>
            <span className="text-white font-bold">{formatCurrency(totalSpent)}</span>
          </div>

          <div className="text-right">
            {isOverBudget ? (
              <span className="text-[#EF4444] font-bold flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3 h-3 inline" />
                Over by {formatCurrency(Math.abs(remaining))}
              </span>
            ) : (
              <div>
                <span className="text-[#8A92A0] text-[11px]">Left </span>
                <span className="text-[#55F130] font-bold">{formatCurrency(remaining)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
