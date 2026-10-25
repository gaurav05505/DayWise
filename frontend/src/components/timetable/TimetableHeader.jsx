import React from 'react';
import { Plus } from 'lucide-react';
import { getTodayDayName } from '../../services/timetableService.js';

export const TimetableHeader = ({
  selectedDay,
  onSelectDay,
  onOpenAddModal,
  dayClassesCount = 0,
}) => {
  const todayName = getTodayDayName();

  const getWeekDays = () => {
    const current = new Date();
    const day = current.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    const days = [];
    const dayNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        fullDay: dayNames[i],
        shortDay: shortNames[i],
        dateNumber: d.getDate(),
        fullDate: d,
        isToday: d.toDateString() === new Date().toDateString(),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const selectedDayInfo = weekDays.find((d) => d.fullDay === selectedDay) || weekDays[0];

  const monthYearStr = selectedDayInfo.fullDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const fullDateStr = selectedDayInfo.fullDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const todayDateNum = new Date().getDate();

  return (
    <div className="w-full space-y-4 pt-5 pb-2">
      <div className="flex items-center justify-between px-0.5">
        <div className="w-10 h-10 rounded-full bg-[#14161F] border border-white/[0.08] flex items-center justify-center text-[#8E95A5] shadow-sm">
          <div className="grid grid-cols-2 gap-1.5 w-3.5 h-3.5 items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E95A5]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E95A5]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E95A5]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E95A5]" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-base sm:text-[17px] font-bold text-white tracking-tight">
            {monthYearStr}
          </h2>
          <p className="text-[12px] text-[#8E95A5] font-medium mt-0.5">
            {fullDateStr}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectDay(todayName)}
          aria-label="Jump to Today"
          className="w-10 h-10 rounded-full bg-[#14161F] border border-white/[0.08] flex items-center justify-center text-[#8E95A5] hover:text-white transition-colors cursor-pointer active:scale-95 shadow-sm"
        >
          <svg
            className="w-5 h-5 text-[#8E95A5] hover:text-white transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="4" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <text
              x="12"
              y="18.5"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="700"
              fill="currentColor"
              stroke="none"
            >
              {todayDateNum}
            </text>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 pt-1 pb-1">
        {weekDays.map((d) => {
          const isSelected = selectedDay === d.fullDay;

          return (
            <button
              key={d.fullDay}
              type="button"
              onClick={() => onSelectDay(d.fullDay)}
              className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group py-1 transition-transform active:scale-95"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#22C55E] text-[#090A0F] shadow-md shadow-[#22C55E]/30 scale-105'
                    : d.isToday
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-[#8E95A5] group-hover:text-white'
                }`}
              >
                {d.dateNumber}
              </div>

              <span
                className={`text-[11px] transition-colors ${
                  isSelected
                    ? 'text-[#22C55E] font-bold'
                    : 'text-[#6B7280] font-medium group-hover:text-[#8E95A5]'
                }`}
              >
                {d.shortDay}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 px-0.5 border-t border-white/[0.04]">
        <div>
          <h1 className="text-[19px] sm:text-[20px] font-bold text-white tracking-tight">
            My Timetable
          </h1>
          <p className="text-xs text-[#8E95A5] mt-0.5">
            {selectedDay} • {dayClassesCount} class{dayClassesCount === 1 ? '' : 'es'} scheduled
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-[#090A0F] text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-[#22C55E]/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Subject</span>
        </button>
      </div>
    </div>
  );
};
