import React, { useState } from 'react';
import { Check, X, MoreVertical, Trash2, Pencil } from 'lucide-react';

export const SubjectCard = ({
  subject,
  onMarkPresent,
  onMarkAbsent,
  onEditSubject,
  onDeleteSubject,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const percentage = Math.round(subject.attendancePercentage ?? 0);
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative">
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-[2.5px] h-3.5 bg-[#8CFF57] rounded-full inline-block shrink-0" />
          <h4 className="text-[14.5px] font-medium text-[#EDEDED] truncate">
            {subject.name}
          </h4>
        </div>

        <p className="text-[12.5px] text-[#9A9A9A] mb-1">
          Attendance :{' '}
          <span className="text-white font-bold text-[14px] ml-1">
            {subject.attendedClasses}/{subject.totalClasses}
          </span>
        </p>

        <p className="text-[12px] text-[#9A9A9A]">
          Status: {subject.status || (percentage >= 75 ? 'On Track' : 'Below Target')}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-[66px] h-[66px] shrink-0 mx-2">
        <svg className="w-[66px] h-[66px] -rotate-90" viewBox="0 0 66 66">
          <circle
            cx="33"
            cy="33"
            r={radius}
            stroke="#262626"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="33"
            cy="33"
            r={radius}
            stroke="#8CFF57"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[13px] font-semibold text-white tracking-tight">
          {percentage}%
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pl-1">
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            aria-label="Mark Present"
            onClick={() => onMarkPresent(subject._id)}
            className="w-[31px] h-[31px] bg-[#1A7909] hover:bg-[#20920c] active:scale-90 transition-all rounded-md flex items-center justify-center text-white cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            aria-label="Mark Absent"
            onClick={() => onMarkAbsent(subject._id)}
            className="w-[31px] h-[31px] bg-[#B90F14] hover:bg-[#d61218] active:scale-90 transition-all rounded-md flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 bg-[#242424] border border-white/10 rounded-xl py-1 px-1 shadow-xl min-w-[120px]">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEditSubject(subject);
                }}
                className="w-full text-left px-3 py-1.5 text-[12.5px] text-[#EDEDED] hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#9A9A9A]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteSubject(subject._id);
                }}
                className="w-full text-left px-3 py-1.5 text-[12.5px] text-[#ff4d4f] hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
