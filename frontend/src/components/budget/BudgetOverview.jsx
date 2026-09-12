import React from 'react';
import { Minus, Plus, Settings2 } from 'lucide-react';
import { BudgetRecommendation } from './BudgetRecommendation.jsx';

export const BudgetOverview = ({
  summary,
  month,
  year,
  shortcuts = [],
  fixedExpenses = [],
  targetSavings = 0,
  onOpenQuickMinus,
  onOpenQuickAdd,
  onOpenSetBudget,
  onOpenCustomShortcuts,
  onOpenPlanning,
  onDirectMinus,
  onDeductOne,
  onDeductAll,
}) => {
  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  const monthlyBudget = summary?.monthlyBudget ?? 0;
  const totalExpenses = summary?.totalExpenses ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const remainingBudget = summary?.remainingBudget ?? 0;

  return (
    <div className="w-full bg-[#181818] border border-white/5 rounded-[22px] p-3.5 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#202020] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#9A9A9A] font-normal">
              {monthNames[month - 1]} {year}
            </span>
            <button
              type="button"
              onClick={onOpenSetBudget}
              className="text-[11px] text-[#FF6B2C] hover:underline cursor-pointer"
            >
              {monthlyBudget > 0 ? 'Edit' : 'Set'}
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[13px] text-[#9A9A9A]">
              Budget :{' '}
              <span className="text-[#EDEDED] font-medium">
                ₹{monthlyBudget.toLocaleString()}
              </span>
            </p>
            <p className="text-[13px] text-[#9A9A9A]">
              Spent :{' '}
              <span className="text-[#ff7875] font-semibold">
                ₹{totalExpenses.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2.5">
          <button
            type="button"
            onClick={onOpenQuickMinus}
            className="w-full bg-[#FF6B2C] hover:bg-[#ff5814] active:scale-[0.98] transition-all text-white text-[13.5px] font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
            <span>Minus Money</span>
          </button>

          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="w-full bg-[#277A10] hover:bg-[#20660c] active:scale-[0.98] transition-all text-white text-[13.5px] font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-[#202020] border border-white/5 rounded-2xl p-4 mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[14px] font-medium text-[#EDEDED]">
            Budget Summary
          </h3>
          <span className="text-[12px] text-[#9A9A9A]">
            {summary?.totalTransactions ?? 0} transactions
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-[12.5px] text-[#9A9A9A]">Remaining</span>
          <span
            className={`text-[15px] font-bold ${
              remainingBudget >= 0 ? 'text-[#8CFF57]' : 'text-[#ff4d4f]'
            }`}
          >
            {remainingBudget >= 0 ? '+' : '-'}₹{Math.abs(remainingBudget).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1 text-[12px] text-[#9A9A9A]">
          <span>Total Income</span>
          <span className="text-[#8CFF57] font-medium">
            +₹{totalIncome.toLocaleString()}
          </span>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11.5px] font-medium text-[#9A9A9A]">
              Quick Deduct
            </span>
            <button
              type="button"
              onClick={onOpenCustomShortcuts}
              className="text-[11px] text-[#FF6B2C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {shortcuts.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => onDirectMinus(btn.amount, btn.label)}
                className="bg-[#282828] hover:bg-[#333333] active:scale-95 text-[#EDEDED] border border-white/5 rounded-xl py-1.5 px-3 text-center font-medium text-[12.5px] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>{btn.label}</span>
                <span className="text-[#FF6B2C] font-semibold text-[11.5px]">
                  -₹{btn.amount}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={onOpenCustomShortcuts}
              className="bg-[#282828]/60 hover:bg-[#282828] text-[#9A9A9A] hover:text-white border border-dashed border-white/10 rounded-xl py-1.5 px-2.5 text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>
        </div>
      </div>

      <BudgetRecommendation
        monthlyBudget={monthlyBudget}
        totalExpenses={totalExpenses}
        fixedExpenses={fixedExpenses}
        targetSavings={targetSavings}
        onOpenPlanning={onOpenPlanning}
        onDeductOne={onDeductOne}
        onDeductAll={onDeductAll}
      />
    </div>
  );
};
