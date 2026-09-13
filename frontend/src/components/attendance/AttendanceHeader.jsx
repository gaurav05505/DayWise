import React from 'react';
import { Calendar } from 'lucide-react';
import { formatTodayDate } from '../../utils/attendanceUtils.js';

export const AttendanceHeader = () => {
  const dateStr = formatTodayDate();

  return (
    <header className="pt-4 pb-2 px-1 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6D1F] to-[#FF9F43] p-[2px] shadow-lg shadow-[#FF6D1F]/10">
            <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">DW</span>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF6D1F] rounded-full border-2 border-[#090A0F]" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#FF6D1F] uppercase tracking-wider block">
            DayWise
          </span>
          <h1 className="text-[17px] font-bold text-white tracking-tight">
            Attendance
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#14171E] border border-white/[0.06] px-3 py-1.5 rounded-full text-xs font-medium text-[#9CA3AF]">
          <Calendar className="w-3.5 h-3.5 text-[#FF6D1F]" />
          <span>{dateStr}</span>
        </div>
      </div>
    </header>
  );
};
