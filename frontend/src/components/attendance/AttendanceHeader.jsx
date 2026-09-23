import React from 'react';
import { Menu } from 'lucide-react';

export const AttendanceHeader = ({ onOpenMenu }) => {
  return (
    <header className="pt-5 pb-3 px-1 flex items-center justify-between">
      <h1 className="text-[22px] font-bold text-white tracking-tight">
        Your Attendance
      </h1>

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Menu"
        className="w-9 h-9 flex items-center justify-center text-white hover:text-[#8A92A0] transition-colors cursor-pointer"
      >
        <Menu className="w-6 h-6 stroke-[2]" />
      </button>
    </header>
  );
};
