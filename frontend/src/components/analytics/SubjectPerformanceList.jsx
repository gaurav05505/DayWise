import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Layers } from 'lucide-react';

export const SubjectPerformanceList = ({
  subjectsComparison = [],
  target = 75,
  onSelectSubject,
}) => {
  if (!subjectsComparison || subjectsComparison.length === 0) return null;

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[22px] p-4 shadow-xl select-none space-y-3">
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-[#F4F5F7] tracking-tight">
            Subject Breakdown
          </h3>
          <Layers className="w-3.5 h-3.5 text-[#9A9DA8]" />
        </div>
        <span className="text-[11px] text-[#9A9DA8] font-medium">
          Target {target}%
        </span>
      </div>

      <div className="space-y-3">
        {subjectsComparison.map((sub) => {
          const isHealthy = sub.percentage >= target;
          const barColor = isHealthy ? '#24D366' : '#F04444';

          return (
            <div
              key={sub._id}
              onClick={() => onSelectSubject?.(sub._id)}
              className="p-2.5 rounded-xl bg-[#141414] border border-white/[0.04] space-y-2 cursor-pointer hover:border-white/10 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-bold text-white truncate">
                  {sub.name}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[13.5px] font-black ${
                      isHealthy ? 'text-[#24D366]' : 'text-[#F04444]'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9A9DA8]" />
                </div>
              </div>

              <div className="relative w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(sub.total > 0 ? 3 : 0, sub.percentage))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#F59E0B]"
                  style={{ left: `${target}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#9A9DA8] leading-tight">
                <span>
                  {sub.attended}/{sub.total} classes
                </span>
                <span>
                  {isHealthy ? (
                    sub.canBunk > 0 ? (
                      <span>Can leave {sub.canBunk} class{sub.canBunk > 1 ? 'es' : ''}</span>
                    ) : (
                      <span>On track ({target}%)</span>
                    )
                  ) : (
                    <span className="text-[#F04444] font-medium">
                      Need {sub.needToAttend} class{sub.needToAttend > 1 ? 'es' : ''}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

