import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Menu } from 'lucide-react';

export const AttendanceHeader = ({ onOpenMenu }) => {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
      setTimeStr(
        now
          .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          .toLowerCase()
          .replace(' ', '')
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="pt-5 pb-5 px-0.5 space-y-3">
      <div className="flex items-center justify-between text-[11.5px] text-[#9A9DA8] font-medium">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#9A9DA8]" />
          <span>{dateStr || 'Today'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#9A9DA8]" />
          <span>{timeStr || 'Now'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[26px] font-bold text-[#F4F5F7] tracking-tight">
          Attendance
        </h1>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Menu"
          className="w-9 h-9 rounded-full bg-[#1D1D1D] border border-white/[0.05] flex items-center justify-center text-[#9A9DA8] hover:text-white transition-colors cursor-pointer active:scale-95 shadow-sm"
        >
          <Menu className="w-4.5 h-4.5 stroke-[2]" />
        </button>
      </div>
    </header>
  );
};
