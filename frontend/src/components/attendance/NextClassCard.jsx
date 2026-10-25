import React from 'react';
import { formatTime12h } from '../../services/timetableService.js';

export const NextClassCard = ({
  nextClass,
  nextClassTiming,
  hasAnySchedule = true,
  onNavigateToTimetable,
}) => {
  let displayContent = 'Exam → 25 nov';

  if (nextClass) {
    let timingText = '';
    if (nextClassTiming?.diffMinutes && nextClassTiming.diffMinutes <= 60) {
      timingText = `${nextClassTiming.diffMinutes}m`;
    } else if (nextClassTiming?.dayLabel === 'Tomorrow') {
      timingText = `Tmrw ${formatTime12h(nextClass.startTime)}`;
    } else if (nextClassTiming?.dayLabel && nextClassTiming.dayLabel !== 'Today') {
      timingText = `${nextClassTiming.dayLabel.substring(0, 3)} ${formatTime12h(nextClass.startTime)}`;
    } else {
      timingText = formatTime12h(nextClass.startTime);
    }
    displayContent = `${nextClass.subjectName} → ${timingText}`;
  } else if (!hasAnySchedule) {
    displayContent = 'Schedule → Set up';
  }

  return (
    <div
      onClick={onNavigateToTimetable}
      className="w-full bg-[#1D1D1D] border border-white/[0.05] text-[#F4F5F7] rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[108px] shadow-lg cursor-pointer select-none active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-[#F4F5F7] tracking-tight leading-tight">
            Upcoming
          </h4>
          <p className="text-[12px] font-medium text-[#9A9DA8] leading-tight mt-0.5">
            event
          </p>
        </div>

        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#9A9DA8] shrink-0">
          <svg
            className="w-4 h-4 text-[#9A9DA8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <p className="text-[13px] font-bold text-[#F4F5F7] truncate leading-tight">
          {displayContent}
        </p>
      </div>
    </div>
  );
};
