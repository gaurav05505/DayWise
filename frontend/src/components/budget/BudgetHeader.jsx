import React from 'react';
import { Wallet, Calendar } from 'lucide-react';

export const BudgetHeader = ({ month, year }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <header className="pt-4 pb-2 px-1 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6D1F] to-[#FF9F43] p-[2px] shadow-lg shadow-[#FF6D1F]/10">
            <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#FF6D1F]" />
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF6D1F] rounded-full border-2 border-[#090A0F]" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#FF6D1F] uppercase tracking-wider block">
            DayWise
          </span>
          <h1 className="text-[17px] font-bold text-white tracking-tight">
            Monthly Budget
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-[#14171E] border border-white/[0.06] px-3 py-1.5 rounded-full text-xs font-medium text-[#9CA3AF]">
        <Calendar className="w-3.5 h-3.5 text-[#FF6D1F]" />
        <span>{monthNames[month - 1]?.slice(0, 3)} {year}</span>
      </div>
    </header>
  );
};
