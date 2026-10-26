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

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeColor = isHealthy ? '#24D366' : '#F04444';
  const strokeDashoffset = totalClasses === 0
    ? circumference
    : circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  if (totalClasses === 0) {
    return (
      <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[22px] p-5 shadow-xl text-center select-none">
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-[#9A9DA8]">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-bold text-white mb-0.5">
          No Attendance Records Yet
        </h3>
        <p className="text-xs text-[#9A9DA8] max-w-[240px] mx-auto leading-relaxed">
          Mark attendance for your classes to view analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[22px] p-4 shadow-xl select-none space-y-3.5">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-[80px] h-[80px] shrink-0">
          <svg className="w-[80px] h-[80px] -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#262626"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke={strokeColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[20px] font-black text-[#F4F5F7] tracking-tight">
            {percentage}%
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isHealthy
                  ? 'bg-[#24D366]/15 text-[#24D366] border border-[#24D366]/25'
                  : 'bg-[#F04444]/15 text-[#F04444] border border-[#F04444]/25'
              }`}
            >
              {isHealthy ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              <span>{isHealthy ? 'On Track' : 'Shortage'}</span>
            </span>

            <span className="text-[11.5px] text-[#9A9DA8] font-medium">
              Target: <strong className="text-white">{target}%</strong>
            </span>
          </div>

          <p className="text-[12.5px] text-[#F4F5F7] font-medium leading-tight">
            {isHealthy ? (
              canBunk > 0 ? (
                <span>Can leave <strong className="text-white font-bold">{canBunk}</strong> class{canBunk > 1 ? 'es' : ''}</span>
              ) : (
                <span>On track ({percentage}%). Keep attending.</span>
              )
            ) : (
              <span>Need <strong className="text-[#F04444] font-bold">{needToAttend}</strong> class{needToAttend > 1 ? 'es' : ''} to reach {target}%</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/[0.05]">
        <div className="bg-[#141414] rounded-xl py-2 px-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Held
          </span>
          <span className="text-[14px] font-bold text-[#F4F5F7] block mt-0.5">
            {totalClasses}
          </span>
        </div>

        <div className="bg-[#141414] rounded-xl py-2 px-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Attended
          </span>
          <span className="text-[14px] font-bold text-[#24D366] block mt-0.5">
            {attendedClasses}
          </span>
        </div>

        <div className="bg-[#141414] rounded-xl py-2 px-2.5 text-center">
          <span className="text-[10px] text-[#9A9DA8] font-medium block uppercase tracking-wider">
            Missed
          </span>
          <span className="text-[14px] font-bold text-[#F04444] block mt-0.5">
            {missedClasses}
          </span>
        </div>
      </div>
    </div>
  );
};
