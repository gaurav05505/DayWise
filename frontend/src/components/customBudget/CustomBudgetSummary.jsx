import React from 'react';
import { formatCurrency } from '../../utils/budgetUtils.js';

export const CustomBudgetSummary = ({ summary }) => {
  const total = summary?.totalCustomBudgets ?? 0;
  const spent = summary?.totalSpent ?? 0;
  const remaining = summary?.totalRemaining ?? 0;

  return (
    <div className="w-full bg-[#14161B] border border-white/[0.04] rounded-[28px] p-4 shadow-xl">
      <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/[0.04]">
        <div className="px-1">
          <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider block mb-1">
            Total Budgets
          </span>
          <span className="text-sm font-black text-white tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="px-1">
          <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider block mb-1">
            Total Spent
          </span>
          <span className="text-sm font-black text-[#EF4444] tracking-tight">
            {formatCurrency(spent)}
          </span>
        </div>

        <div className="px-1">
          <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider block mb-1">
            Remaining
          </span>
          <span
            className={`text-sm font-black tracking-tight ${
              remaining >= 0 ? 'text-[#4ADE80]' : 'text-[#EF4444]'
            }`}
          >
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
};
