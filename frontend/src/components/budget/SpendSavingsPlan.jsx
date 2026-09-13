import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Zap, ChevronDown } from 'lucide-react';

export const SpendSavingsPlan = ({
  fixedExpenses = [],
  targetSavings = 0,
  onOpenPlanning,
  onDeductOne,
  onDeductAll,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const totalFixed = fixedExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  return (
    <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 shadow-lg transition-all overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[13.5px] font-bold text-white">
              Monthly Spend Plan
            </h3>
            <span className="text-[11px] text-[#8A92A0] font-medium">
              Fixed: ₹{totalFixed.toLocaleString()} • Savings: ₹{Number(targetSavings).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPlanning}
            className="text-xs font-semibold text-[#FF6D1F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white bg-[#1A1F29] transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="spend-plan-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-2 mb-3 py-2.5 bg-[#1A1F29] border border-white/[0.06] rounded-2xl px-3 text-xs">
                <div>
                  <span className="text-[#8A92A0] block text-[11px]">Fixed (Rent/Rasan)</span>
                  <span className="text-white font-bold text-sm">
                    ₹{totalFixed.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A92A0] block text-[11px]">Target Savings</span>
                  <span className="text-white font-bold text-sm">
                    ₹{Number(targetSavings).toLocaleString()}
                  </span>
                </div>
              </div>

              {fixedExpenses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-semibold text-[#8A92A0]">Fixed Expenses ({fixedExpenses.length})</span>
                    {fixedExpenses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeductAll(fixedExpenses)}
                        className="bg-[#FF6D1F]/15 hover:bg-[#FF6D1F]/25 active:scale-95 text-[#FF6D1F] text-[11px] font-bold py-1 px-2.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Deduct All (₹{totalFixed.toLocaleString()})</span>
                      </button>
                    )}
                  </div>

                  {fixedExpenses.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-[#1A1F29] border border-white/[0.06] rounded-2xl px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{item.title}</span>
                        <span className="text-[#8A92A0] text-[11px]">
                          ₹{Number(item.amount).toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeductOne(item)}
                        className="bg-[#14171E] hover:bg-[#222834] active:scale-95 text-[#EF4444] text-[11px] font-bold py-1 px-2.5 rounded-xl border border-white/[0.06] transition-all cursor-pointer"
                      >
                        − Deduct
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

