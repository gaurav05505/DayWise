import React from 'react';
import { DAYS_OF_WEEK, getTodayDayName } from '../../services/timetableService.js';

const DAY_LABELS = [
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
];

export const DaySelector = ({ selectedDay, onSelectDay, allClasses = [] }) => {
  const todayName = getTodayDayName();

  const getDayCount = (dayName) => {
    return allClasses.filter((c) => c.day === dayName).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
        {DAY_LABELS.map(({ full, short }) => {
          const isSelected = selectedDay === full;
          const isToday = todayName === full;
          const count = getDayCount(full);

          return (
            <button
              key={full}
              type="button"
              onClick={() => onSelectDay(full)}
              className={`flex-1 min-w-[48px] py-2 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-white text-zinc-950 shadow-md font-bold'
                  : 'bg-[#1D1D1D] text-[#8E95A5] hover:text-white border border-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-[12px] uppercase tracking-wider font-bold">
                  {short}
                </span>
                {isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-600' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </div>

              <div className="text-[10px] font-medium leading-none">
                {count > 0 ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isSelected
                        ? 'bg-zinc-200 text-zinc-900'
                        : 'bg-white/5 text-[#8E95A5]'
                    }`}
                  >
                    {count}
                  </span>
                ) : (
                  <span className="text-white/20 text-[10px]">•</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

