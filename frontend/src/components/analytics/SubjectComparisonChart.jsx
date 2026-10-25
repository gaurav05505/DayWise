import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ChevronRight } from 'lucide-react';

export const SubjectComparisonChart = ({
  subjectsComparison = [],
  target = 75,
  onSelectSubject,
}) => {
  if (!subjectsComparison || subjectsComparison.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-4 sm:p-5 shadow-xl select-none space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#F4F5F7] tracking-tight">
              Compare Subjects
            </h3>
            <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[#9A9DA8]">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[11.5px] text-[#9A9DA8] font-medium mt-0.5">
            Sorted from lowest to highest attendance
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F59E0B]">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Target {target}%</span>
        </div>
      </div>

      <div className="relative pt-2 pb-1 space-y-3">
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-10 flex flex-col items-center"
          style={{ left: `calc(100px + (100% - 150px) * ${target / 100})` }}
        >
          <div className="h-full border-r border-dashed border-[#F59E0B]/60" />
        </div>

        {subjectsComparison.map((sub) => {
          const isHealthy = sub.percentage >= target;
          const barColor = isHealthy ? '#24D366' : '#F04444';

          return (
            <div
              key={sub._id}
              onClick={() => onSelectSubject?.(sub._id)}
              className="group flex items-center gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="w-[100px] shrink-0 text-right pr-2">
                <span className="text-[12.5px] font-bold text-[#F4F5F7] block truncate">
                  {sub.name}
                </span>
                <span className="text-[10px] text-[#9A9DA8] block">
                  {sub.attended}/{sub.total} classes
                </span>
              </div>

              <div className="flex-1 relative h-6 bg-[#141414] rounded-lg overflow-hidden flex items-center p-0.5 border border-white/[0.04]">
                <motion.div
                  className="h-full rounded-md"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(2, sub.percentage))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="w-[48px] shrink-0 flex items-center justify-between">
                <span
                  className={`text-[12.5px] font-extrabold ${
                    isHealthy ? 'text-[#24D366]' : 'text-[#F04444]'
                  }`}
                >
                  {sub.percentage}%
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9A9DA8] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
