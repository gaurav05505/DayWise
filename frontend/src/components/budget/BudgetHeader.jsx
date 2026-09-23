import React from 'react';
import { Wallet, Calendar } from 'lucide-react';

export const BudgetHeader = ({ month, year }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <header className="pt-5 pb-3 px-1 flex items-center justify-between">
      <h1 className="text-[22px] font-bold text-white tracking-tight">
        Your Budget
      </h1>

      <div className="flex items-center gap-1.5 bg-[#1B1E26] border border-white/[0.04] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8A92A0]">
        <Calendar className="w-3.5 h-3.5 text-[#55F130]" />
        <span>{monthNames[month - 1]?.slice(0, 3)} {year}</span>
      </div>
    </header>
  );
};
