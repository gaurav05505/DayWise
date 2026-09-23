import React from 'react';

export const CategoryBreakdown = ({ categorySummary, totalExpenses }) => {
  if (!categorySummary || categorySummary.length === 0) return null;

  return (
    <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 mt-3 shadow-lg">
      <h3 className="text-[14px] font-bold text-white mb-3 tracking-tight">
        Expense Breakdown
      </h3>

      <div className="space-y-3">
        {categorySummary.map((item) => {
          const percentage =
            totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0;

          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-semibold">
                  {item.category}
                </span>
                <span className="text-[#8A92A0]">
                  ₹{item.total.toLocaleString()}{' '}
                  <span className="text-[11px] text-[#64748B]">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-[#1A1F29] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#55F130] h-full rounded-full transition-all duration-500"
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
