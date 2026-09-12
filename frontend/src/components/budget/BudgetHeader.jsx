import React from 'react';

export const BudgetHeader = ({ month, year }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="w-full pt-4 pb-2 px-4 flex items-center justify-between">
      <div>
        <h1 className="text-[19px] font-semibold text-[#EDEDED] tracking-tight">
          Your Budget
        </h1>
        <p className="text-[12px] text-[#9A9A9A]">
          {monthNames[month - 1]} {year}
        </p>
      </div>

      <button
        type="button"
        aria-label="Menu"
        className="text-[#D1D1D1] hover:text-white transition-colors p-1 cursor-pointer"
      >
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="2" x2="20" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="14" x2="8" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};
