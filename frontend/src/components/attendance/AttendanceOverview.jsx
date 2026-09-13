import React, { useState, useEffect } from 'react';
import { Plus, CheckCheck, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AttendanceRecommendation } from './AttendanceRecommendation.jsx';

export const AttendanceOverview = ({
  summary,
  onOpenAddModal,
  onOpenBulkModal,
  progressCardColor = '#FF6D1F',
  showRecommendations = true,
}) => {
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('daywise_attendance_minimized') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('daywise_attendance_minimized', String(isMinimized));
    } catch {}
  }, [isMinimized]);

  const currentPercentage = Math.round(
    summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
  );
  const targetPercentage = Math.round(
    summary?.targetAttendance ?? summary?.target ?? 75
  );
  const totalClasses = summary?.totalClasses ?? 0;
  const attendedClasses = summary?.attendedClasses ?? 0;
  const isHealthy = currentPercentage >= targetPercentage;
  const isCharcoal = progressCardColor === '#212121';

  return (
    <div className="w-full space-y-3 mt-3">
      <motion.div
        layout
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`w-full rounded-[28px] p-4 sm:p-5 text-white relative transition-colors ${
          isCharcoal
            ? 'bg-[#14171E] border border-white/[0.06] shadow-xl'
            : 'bg-[#FF6D1F] shadow-xl shadow-[#FF6D1F]/15'
        }`}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isCharcoal ? 'bg-[#FF6D1F]/15 text-[#FF6D1F]' : 'bg-black/15 text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isCharcoal ? 'text-white' : 'text-white/90'
              }`}
            >
              Overall Progress
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                isCharcoal
                  ? 'bg-[#1A1F29] border border-white/[0.06] text-white'
                  : 'bg-black/15 text-white'
              }`}
            >
              Target: {targetPercentage}%
            </div>

            <button
              type="button"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
              onClick={() => setIsMinimized((prev) => !prev)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer ${
                isCharcoal ? 'bg-[#1A1F29] hover:bg-[#222834] border border-white/[0.06]' : 'bg-black/15 hover:bg-black/25'
              }`}
            >
              {isMinimized ? (
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isMinimized ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-end justify-between relative z-10 my-4">
                <div>
                  <div className="text-4xl font-black tracking-tight leading-none text-white">
                    {currentPercentage}%
                  </div>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                    }`}
                  >
                    {attendedClasses} of {totalClasses} classes attended
                  </p>
                </div>

                <div
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm ${
                    isCharcoal
                      ? isHealthy
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                      : 'bg-[#090A0F] text-white'
                  }`}
                >
                  {isHealthy ? 'On Track' : 'Need Attention'}
                </div>
              </div>

              <div
                className={`w-full h-2.5 rounded-full overflow-hidden relative z-10 ${
                  isCharcoal ? 'bg-[#1A1F29] border border-white/[0.06]' : 'bg-black/20'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCharcoal ? 'bg-[#FF6D1F]' : 'bg-white'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, currentPercentage))}%` }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`overflow-hidden mt-3 pt-2 border-t ${
                isCharcoal ? 'border-white/[0.06]' : 'border-white/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    {currentPercentage}%
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                    }`}
                  >
                    ({attendedClasses}/{totalClasses} attended)
                  </span>
                </div>

                <div
                  className={`w-24 h-2 rounded-full overflow-hidden ${
                    isCharcoal ? 'bg-[#1A1F29] border border-white/[0.06]' : 'bg-black/20'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      isCharcoal ? 'bg-[#FF6D1F]' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, currentPercentage))}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="bg-[#14171E] hover:bg-[#1A1F29] active:scale-[0.98] border border-white/[0.06] rounded-2xl py-2.5 px-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-white font-bold text-xs"
        >
          <Plus className="w-4 h-4 text-[#FF6D1F] stroke-[2.5]" />
          <span>Add Subject</span>
        </button>

        <button
          type="button"
          onClick={onOpenBulkModal}
          className="bg-[#14171E] hover:bg-[#1A1F29] active:scale-[0.98] border border-white/[0.06] rounded-2xl py-2.5 px-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md text-white font-bold text-xs"
        >
          <CheckCheck className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
          <span>Daily Class</span>
        </button>
      </div>

      {showRecommendations && (
        <AttendanceRecommendation recommendation={summary?.recommendation} />
      )}
    </div>
  );
};
