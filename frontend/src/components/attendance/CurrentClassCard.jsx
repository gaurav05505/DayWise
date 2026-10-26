import React from 'react';
import { formatTime12h } from '../../services/timetableService.js';
import { Coffee } from 'lucide-react';

export const CurrentClassCard = ({
  currentClass,
  matchedSubject,
  statusLabel = 'No class right now',
  markedStatus = null,
  onMarkAttendance,
  isMarking = false,
  nextClass = null,
  onNavigateToTimetable,
}) => {
  const percentage = matchedSubject
    ? Math.round(matchedSubject.percentage ?? matchedSubject.attendancePercentage ?? 0)
    : null;

  if (!currentClass) {
    return (
      <div
        onClick={onNavigateToTimetable}
        className="w-full bg-[#1D1D1D] border border-white/[0.05] text-[#F4F5F7] rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[108px] shadow-lg select-none cursor-pointer transition-transform active:scale-[0.98]"
      >
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h4 className="text-[14px] font-bold text-[#F4F5F7] truncate tracking-tight leading-tight">
              Current Class
            </h4>
            <p className="text-[12px] font-medium text-[#24D366] leading-tight mt-0.5 truncate">
              You are free now
            </p>
          </div>

          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#9A9DA8] shrink-0">
            <Coffee className="w-4 h-4 text-[#9A9DA8]" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-1 mt-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#24D366] shrink-0" />
            <span className="text-[12.5px] font-bold text-white truncate">
              {nextClass ? `Next: ${nextClass.subjectName}` : 'No running class'}
            </span>
          </div>

          {nextClass && (
            <span className="text-[11px] text-[#9A9DA8] shrink-0 font-medium">
              {formatTime12h(nextClass.startTime)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1D1D1D] border border-white/[0.05] text-[#F4F5F7] rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[108px] shadow-lg select-none">
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-[#F4F5F7] truncate tracking-tight leading-tight">
            {currentClass.subjectName}
          </h4>
          <p className="text-[12px] font-medium text-[#24D366] leading-tight mt-0.5 truncate">
            {currentClass.room ? `${currentClass.room} • ` : ''}Ends {formatTime12h(currentClass.endTime)}
          </p>
        </div>

        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#9A9DA8] shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#24D366] animate-pulse" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 mt-2.5">
        <div className="min-w-0">
          <span className="text-[20px] font-extrabold text-[#F4F5F7] tracking-tight leading-none">
            {percentage !== null ? `${percentage}%` : '0%'}
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
            className={`w-7.5 h-7.5 rounded-[8px] bg-[#F04444] hover:bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm transition-all cursor-pointer active:scale-90 disabled:opacity-40 ${
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
