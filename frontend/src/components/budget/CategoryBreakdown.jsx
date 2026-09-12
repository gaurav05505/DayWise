import React from 'react';

export const CategoryBreakdown = ({ categorySummary, totalExpenses }) => {
  if (!categorySummary || categorySummary.length === 0) return null;

  return (
    <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 mt-3.5">
      <h3 className="text-[14px] font-medium text-[#EDEDED] mb-3">
        Expense Breakdown
      </h3>

      <div className="space-y-2.5">
        {categorySummary.map((item) => {
          const percentage =
            totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0;

          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[#EDEDED] font-medium">
                  {item.category}
                </span>
                <span className="text-[#9A9A9A]">
                  ₹{item.total.toLocaleString()}{' '}
                  <span className="text-[11px] text-[#777777]">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF6B2C] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

