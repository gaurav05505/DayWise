import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const OverallAttendanceCard = ({ summary }) => {
  const totalClasses = Number(summary?.totalClasses) || 0;
  const attendedClasses = Number(summary?.attendedClasses ?? summary?.totalAttendedClasses) || 0;
  const missedClasses = Math.max(0, totalClasses - attendedClasses);
  const target = Number(summary?.target ?? summary?.targetAttendance) || 75;

  const percentage = Math.round(
    summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? (totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0)
  );

  const isHealthy = summary?.isTargetMet !== undefined
    ? summary.isTargetMet
    : totalClasses === 0
    ? true
    : attendedClasses * 100 >= target * totalClasses;

  const canBunk = summary?.canBunk ?? 0;
  const needToAttend = summary?.needToAttend ?? 0;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = isHealthy ? '#24D366' : '#F04444';
  const strokeDashoffset = totalClasses === 0
    ? circumference
    : circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  if (totalClasses === 0) {
    return (
      <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-5 shadow-xl text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-[#9A9DA8]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          No Attendance Records Yet
        </h3>
        <p className="text-xs text-[#9A9DA8] max-w-[260px] mx-auto leading-relaxed">
          Mark attendance for your classes to view live aggregated statistics, trends, and target tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-4 sm:p-5 shadow-xl select-none space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#9A9DA8] uppercase tracking-wider">
          Overall Status
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
            isHealthy
              ? 'bg-[#24D366]/15 text-[#24D366] border border-[#24D366]/25'
              : 'bg-[#F04444]/15 text-[#F04444] border border-[#F04444]/25'
          }`}
        >
          {isHealthy ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>{isHealthy ? 'On Track' : 'Attendance Shortage'}</span>
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative flex items-center justify-center w-[92px] h-[92px] shrink-0">
          <svg className="w-[92px] h-[92px] -rotate-90" viewBox="0 0 92 92">
            <circle
              cx="46"
              cy="46"
              r={radius}
              stroke="#262626"
              strokeWidth="7"
              fill="transparent"
            />
            <motion.circle
              cx="46"
              cy="46"
              r={radius}
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[21px] font-black text-[#F4F5F7] tracking-tight leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] font-medium text-[#9A9DA8] mt-0.5">
              Target {target}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#F4F5F7] font-medium leading-snug">
            {isHealthy ? (
              canBunk > 0 ? (
                <>
                  You can safely miss <strong className="text-white font-bold">{canBunk}</strong> class{canBunk > 1 ? 'es' : ''} while maintaining at least {target}% attendance.
                </>
              ) : (
                <>
                  You are exactly on track at <strong className="text-[#24D366] font-bold">{percentage}%</strong>. Keep attending all upcoming sessions.
                </>
              )
            ) : (
              <>
                You must attend <strong className="text-[#F04444] font-bold">{needToAttend}</strong> consecutive class{needToAttend > 1 ? 'es' : ''} to recover to {target}%.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.05]">
        <div className="bg-[#141414] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Held
          </span>
          <span className="text-[15px] font-bold text-[#F4F5F7] block mt-0.5">
            {totalClasses}
          </span>
        </div>

        <div className="bg-[#141414] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Attended
          </span>
          <span className="text-[15px] font-bold text-[#24D366] block mt-0.5">
            {attendedClasses}
          </span>
        </div>

        <div className="bg-[#141414] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Missed
          </span>
          <span className="text-[15px] font-bold text-[#F04444] block mt-0.5">
            {missedClasses}
          </span>
        </div>

        <div className="bg-[#141414] rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Target
          </span>
          <span className="text-[15px] font-bold text-[#F59E0B] block mt-0.5">
            {target}%
          </span>
        </div>
      </div>
    </div>
  );
};
