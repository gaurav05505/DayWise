import React from 'react';
import { Plus, Calendar, CalendarDays, Layers } from 'lucide-react';
import { getTodayDayName } from '../../services/timetableService.js';

export const TimetableHeader = ({
  selectedDay,
  onSelectDay,
  onOpenAddModal,
  onOpenWeekPlan,
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
    month: 'short',
  });

  return (
    <div className="w-full space-y-3 pt-4 pb-1">
      <div className="flex items-center justify-between px-0.5">
        <div className="w-9 h-9 rounded-full aspect-square bg-[#1D1D1D] border border-white/[0.05] flex items-center justify-center text-[#9A9DA8] shadow-sm shrink-0">
          <Calendar className="w-4 h-4 text-[#9A9DA8] shrink-0" />
        </div>

        <div className="text-center">
          <h2 className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight">
            {monthYearStr}
          </h2>
          <p className="text-[11.5px] text-[#9A9DA8] font-medium mt-0.5">
            {fullDateStr}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectDay(todayName)}
          aria-label="Jump to Today"
          className="w-9 h-9 rounded-full aspect-square bg-[#1D1D1D] border border-white/[0.05] flex items-center justify-center text-[#9A9DA8] hover:text-white transition-colors cursor-pointer active:scale-95 shadow-sm shrink-0"
        >
          <CalendarDays className="w-4 h-4 text-[#9A9DA8] hover:text-white transition-colors shrink-0" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 py-1">
        {weekDays.map((d) => {
          const isSelected = selectedDay === d.fullDay;

          return (
            <button
              key={d.fullDay}
              type="button"
              onClick={() => onSelectDay(d.fullDay)}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer py-0.5 transition-transform active:scale-95"
            >
              <div
                className={`w-9 h-9 aspect-square rounded-full flex items-center justify-center text-[13px] font-bold leading-none shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#24D366] text-[#0B0C0F] shadow-md shadow-[#24D366]/30 font-extrabold scale-105'
                    : d.isToday
                    ? 'bg-white/10 text-white font-bold border border-white/20'
                    : 'text-[#9A9DA8] hover:text-white hover:bg-white/5'
                }`}
              >
                {d.dateNumber}
              </div>

              <span
                className={`text-[11px] leading-none transition-colors ${
                  isSelected
                    ? 'text-[#24D366] font-bold'
                    : 'text-[#6B7280] font-medium'
                }`}
              >
                {d.shortDay}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2.5 px-0.5 border-t border-white/[0.05]">
        <div>
          <h1 className="text-[19px] sm:text-[20px] font-bold text-white tracking-tight">
            Schedule
          </h1>
          <p className="text-[11.5px] text-[#9A9DA8] mt-0.5">
            {selectedDay} • {dayClassesCount} class{dayClassesCount === 1 ? '' : 'es'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenWeekPlan}
            className="bg-[#1D1D1D] hover:bg-white/10 text-white border border-white/[0.08] text-[12px] font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-[#24D366] shrink-0" />
            <span>Week Plan</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="bg-[#24D366] hover:bg-[#16A34A] text-[#0B0C0F] text-[12.5px] font-bold py-2 px-3.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Add Class</span>
          </button>
        </div>
      </div>
    </div>
  );
};

