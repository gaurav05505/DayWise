import React from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

export const AttendanceDistributionCard = ({ summary }) => {
  const totalClasses = Number(summary?.totalClasses) || 0;
  const attendedClasses = Number(summary?.attendedClasses ?? summary?.totalAttendedClasses) || 0;
  const missedClasses = Math.max(0, totalClasses - attendedClasses);

  if (totalClasses === 0) return null;

  const attendedPercent = Math.round((attendedClasses / totalClasses) * 100);
  const missedPercent = 100 - attendedPercent;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const attendedOffset = circumference - (attendedPercent / 100) * circumference;

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-4 sm:p-5 shadow-xl select-none space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-[#F4F5F7] tracking-tight">
          Attendance Distribution
        </h3>
        <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[#9A9DA8]">
          <PieChart className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="relative flex items-center justify-center w-[84px] h-[84px] shrink-0">
          <svg className="w-[84px] h-[84px] -rotate-90" viewBox="0 0 84 84">
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke="#F04444"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="42"
              cy="42"
              r={radius}
              stroke="#24D366"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: attendedOffset }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[14px] font-black text-white leading-none">
              {totalClasses}
            </span>
            <span className="text-[9px] text-[#9A9DA8] uppercase tracking-wider mt-0.5">
              Sessions
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <div className="bg-[#141414] rounded-xl p-2.5 flex items-center justify-between border border-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#24D366]" />
              <span className="text-xs font-semibold text-[#F4F5F7]">Attended</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#24D366]">
                {attendedClasses}
              </span>
              <span className="text-[10px] text-[#9A9DA8] ml-1 font-medium">
                ({attendedPercent}%)
              </span>
            </div>
          </div>

          <div className="bg-[#141414] rounded-xl p-2.5 flex items-center justify-between border border-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F04444]" />
              <span className="text-xs font-semibold text-[#F4F5F7]">Missed</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#F04444]">
                {missedClasses}
              </span>
              <span className="text-[10px] text-[#9A9DA8] ml-1 font-medium">
                ({missedPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
