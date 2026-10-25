import React from 'react';
import { formatTime12h } from '../../services/timetableService.js';

export const CurrentClassCard = ({
  currentClass,
  matchedSubject,
  statusLabel = 'No class right now',
  markedStatus = null,
  onMarkAttendance,
  isMarking = false,
}) => {
  const percentage = matchedSubject
    ? Math.round(matchedSubject.percentage ?? matchedSubject.attendancePercentage ?? 0)
    : null;

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] text-[#F4F5F7] rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[108px] shadow-lg select-none">
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-[#F4F5F7] truncate tracking-tight leading-tight">
            {currentClass ? currentClass.subjectName : 'Maths'}
          </h4>
          <p className="text-[12px] font-medium text-[#9A9DA8] leading-tight mt-0.5 truncate">
            {currentClass ? (statusLabel === 'Ongoing' ? 'Attendance' : statusLabel) : 'Attendance'}
          </p>
        </div>

        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#9A9DA8] shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="7" r="3" />
            <circle cx="6" cy="15" r="2.5" />
            <circle cx="18" cy="15" r="2.5" />
          </svg>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 mt-2.5">
        <div className="min-w-0">
          <span className="text-[20px] font-extrabold text-[#F4F5F7] tracking-tight leading-none">
            {percentage !== null ? `${percentage}%` : currentClass ? formatTime12h(currentClass.startTime) : '84%'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={isMarking}
            onClick={() => onMarkAttendance?.('present')}
            aria-label="Mark Present"
            className={`w-7.5 h-7.5 rounded-[8px] bg-[#24D366] hover:bg-[#16A34A] text-white flex items-center justify-center font-black text-xs shadow-sm transition-all cursor-pointer active:scale-90 disabled:opacity-40 ${
              markedStatus === 'present'
                ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1D1D1D] scale-105'
                : ''
            }`}
          >
            ✓
          </button>

          <button
            type="button"
            disabled={isMarking}
            onClick={() => onMarkAttendance?.('absent')}
            aria-label="Mark Absent"
            className={`w-7.5 h-7.5 rounded-[8px] bg-[#8B0000] hover:bg-[#700000] text-white flex items-center justify-center font-black text-xs shadow-sm transition-all cursor-pointer active:scale-90 disabled:opacity-40 ${
              markedStatus === 'absent'
                ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1D1D1D] scale-105'
                : ''
            }`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
