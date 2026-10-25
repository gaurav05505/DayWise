import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';

export const SubjectAttendanceList = ({
  subjects = [],
  target = 75,
  onSelectSubject,
}) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold text-[#F4F5F7] tracking-tight">
            Subject-wise Attendance
          </h3>
          <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[#9A9DA8]">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[11px] text-[#9A9DA8] font-medium">
          {subjects.length} Course{subjects.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2.5">
        {subjects.map((sub) => {
          const total = Number(sub.totalClasses) || 0;
          const attended = Number(sub.attendedClasses) || 0;
          const percentage = Math.round(
            sub.percentage ?? (total > 0 ? (attended / total) * 100 : 0)
          );
          const isHealthy = sub.isTargetMet !== undefined
            ? sub.isTargetMet
            : total === 0
            ? true
            : attended * 100 >= target * total;

          const canBunk = sub.canBunk ?? 0;
          const needToAttend = sub.needToAttend ?? 0;
          const strokeColor = isHealthy ? '#24D366' : '#F04444';

          const radius = 18;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = total === 0
            ? circumference
            : circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

          return (
            <div
              key={sub._id}
              onClick={() => onSelectSubject?.(sub._id)}
              className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[20px] p-3.5 shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:border-white/10 active:scale-[0.99] transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-1 h-3 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: strokeColor }}
                  />
                  <h4 className="text-[14px] font-bold text-[#F4F5F7] truncate">
                    {sub.name}
                  </h4>
                </div>

                <p className="text-[12px] text-[#9A9DA8] font-medium">
                  Attendance :{' '}
                  <span className="text-white font-bold ml-1">
                    {attended}/{total}
                  </span>
                </p>

                <p className="text-[11px] text-[#9A9DA8] mt-0.5 font-normal truncate">
                  {isHealthy ? (
                    canBunk > 0 ? (
                      <span>You can leave {canBunk} class{canBunk > 1 ? 'es' : ''}</span>
                    ) : (
                      <span>On track ({target}%)</span>
                    )
                  ) : (
                    <span className="text-[#F04444]">
                      Need {needToAttend} class{needToAttend > 1 ? 'es' : ''}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative flex items-center justify-center w-[46px] h-[46px]">
                  <svg className="w-[46px] h-[46px] -rotate-90" viewBox="0 0 46 46">
                    <circle
                      cx="23"
                      cy="23"
                      r={radius}
                      stroke="#262626"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <circle
                      cx="23"
                      cy="23"
                      r={radius}
                      stroke={strokeColor}
                      strokeWidth="3.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10.5px] font-bold text-white tracking-tight">
                    {percentage}%
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-[#9A9DA8]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
