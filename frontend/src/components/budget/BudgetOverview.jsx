import React, { useState, useEffect } from 'react';
import { Minus, Plus, Settings2, Wallet, ArrowDownRight, ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpendSavingsPlan } from './SpendSavingsPlan.jsx';
import { BudgetRecommendation } from './BudgetRecommendation.jsx';

export const BudgetOverview = ({
  summary,
  month,
  year,
  shortcuts = [],
  fixedExpenses = [],
  targetSavings = 0,
  progressCardColor = '#FF6D1F',
  showRecommendations = true,
  onOpenQuickMinus,
  onOpenQuickAdd,
  onOpenSetBudget,
  onOpenCustomShortcuts,
  onOpenPlanning,
  onDirectMinus,
  onDeductOne,
  onDeductAll,
}) => {
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('daywise_budget_minimized') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('daywise_budget_minimized', String(isMinimized));
    } catch {}
  }, [isMinimized]);

  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  const monthlyBudget = Number(summary?.monthlyBudget) || 0;
  const totalExpenses = Number(summary?.totalExpense ?? summary?.totalExpenses) || 0;
  const remainingBudget = monthlyBudget > 0 ? (monthlyBudget - totalExpenses) : -(totalExpenses);
  const percentageSpent = monthlyBudget > 0 ? Math.round((totalExpenses / monthlyBudget) * 100) : 0;
  const isHealthy = remainingBudget >= 0;
  const isCharcoal = progressCardColor === '#212121';

  return (
    <div className="w-full space-y-3 mt-3">
      <motion.div
        layout
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`w-full rounded-[28px] p-4 sm:p-5 text-white relative transition-colors ${
          isCharcoal
            ? 'bg-[#14171E] border border-white/[0.06] shadow-xl'
            : 'bg-[#FF6D1F] shadow-xl shadow-[#FF6D1F]/15'
        }`}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isCharcoal ? 'bg-[#FF6D1F]/15 text-[#FF6D1F]' : 'bg-black/15 text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isCharcoal ? 'text-white' : 'text-white/90'
              }`}
            >
              {monthNames[month - 1]} {year} Budget
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSetBudget}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                isCharcoal
                  ? 'bg-[#1A1F29] hover:bg-[#222834] text-white border border-white/[0.06]'
                  : 'bg-[#090A0F] text-white hover:bg-black'
              }`}
            >
              {monthlyBudget > 0 ? 'Edit' : 'Set'}
            </button>

            <button
              type="button"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
              onClick={() => setIsMinimized((prev) => !prev)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer ${
                isCharcoal ? 'bg-[#1A1F29] hover:bg-[#222834] border border-white/[0.06]' : 'bg-black/15 hover:bg-black/25'
              }`}
            >
              {isMinimized ? (
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isMinimized ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 relative z-10 my-4">
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider block ${
                      isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                    }`}
                  >
                    Remaining Left
                  </span>
                  <div className="text-3xl font-black tracking-tight leading-none text-white mt-1">
                    ₹{Math.abs(remainingBudget).toLocaleString()}
                  </div>
                  <span
                    className={`text-[11px] font-semibold block mt-1 ${
                      isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                    }`}
                  >
                    {isHealthy ? 'Available to spend' : 'Over budget limit'}
                  </span>
                </div>

                <div
                  className={`space-y-1.5 border-l pl-3.5 ${
                    isCharcoal ? 'border-white/[0.06]' : 'border-white/20'
                  }`}
                >
                  <div>
                    <span
                      className={`text-[10.5px] font-semibold block ${
                        isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                      }`}
                    >
                      Total Budget
                    </span>
                    <span className="text-sm font-bold text-white">
                      ₹{monthlyBudget.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[10.5px] font-semibold block ${
                        isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                      }`}
                    >
                      Total Spent
                    </span>
                    <span className="text-sm font-bold text-white">
                      ₹{totalExpenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`w-full h-2.5 rounded-full overflow-hidden relative z-10 ${
                  isCharcoal ? 'bg-[#1A1F29] border border-white/[0.06]' : 'bg-black/20'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCharcoal ? 'bg-[#FF6D1F]' : 'bg-white'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, percentageSpent))}%` }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`overflow-hidden mt-3 pt-2 border-t ${
                isCharcoal ? 'border-white/[0.06]' : 'border-white/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    ₹{Math.abs(remainingBudget).toLocaleString()}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                    }`}
                  >
                    left of ₹{monthlyBudget.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`w-24 h-2 rounded-full overflow-hidden ${
                    isCharcoal ? 'bg-[#1A1F29] border border-white/[0.06]' : 'bg-black/20'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      isCharcoal ? 'bg-[#FF6D1F]' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, percentageSpent))}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenQuickMinus}
          className="bg-[#14171E] hover:bg-[#1A1F29] active:scale-[0.98] border border-white/[0.06] rounded-2xl py-2.5 px-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-white font-bold text-xs"
        >
          <ArrowDownRight className="w-4 h-4 text-[#EF4444] stroke-[2.5]" />
          <span>Minus Money</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="bg-[#14171E] hover:bg-[#1A1F29] active:scale-[0.98] border border-white/[0.06] rounded-2xl py-2.5 px-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-white font-bold text-xs"
        >
          <ArrowUpRight className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
          <span>Add Money</span>
        </button>
      </div>

      <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A92A0]">
              Quick Deduct
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenCustomShortcuts}
            className="text-xs font-semibold text-[#FF6D1F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {shortcuts.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => onDirectMinus(btn.amount, btn.label)}
              className="bg-[#1A1F29] hover:bg-[#222834] active:scale-95 text-[#F3F4F6] border border-white/[0.06] rounded-2xl py-2 px-3.5 text-center font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>{btn.label}</span>
              <span className="text-[#EF4444] font-bold">
                -₹{btn.amount}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenCustomShortcuts}
            className="bg-[#1A1F29]/60 hover:bg-[#1A1F29] text-[#8A92A0] hover:text-white border border-dashed border-white/10 rounded-2xl py-2 px-3 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>New</span>
          </button>
        </div>
      </div>

      <SpendSavingsPlan
        fixedExpenses={fixedExpenses}
        targetSavings={targetSavings}
        onOpenPlanning={onOpenPlanning}
        onDeductOne={onDeductOne}
        onDeductAll={onDeductAll}
      />

      {showRecommendations && (
        <BudgetRecommendation
          monthlyBudget={monthlyBudget}
          totalExpenses={totalExpenses}
          fixedExpenses={fixedExpenses}
          targetSavings={targetSavings}
        />
      )}
    </div>
  );
};
