import React from 'react';
import { Plus, Check } from 'lucide-react';
import { formatTodayDate } from '../../utils/attendanceUtils.js';
import { AttendanceRecommendation } from './AttendanceRecommendation.jsx';

export const AttendanceOverview = ({
  summary,
  onOpenAddModal,
  onOpenBulkModal,
}) => {
  const dateStr = formatTodayDate();
  const currentPercentage = Math.round(summary?.overallAttendancePercentage ?? 0);
  const targetPercentage = Math.round(summary?.targetAttendance ?? 75);

  return (
    <div className="w-full bg-[#181818] border border-white/5 rounded-[22px] p-3.5 mt-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#202020] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[13px] text-[#9A9A9A] font-normal block mb-2.5">
            {dateStr}
          </span>
          <div className="space-y-1">
            <p className="text-[13.5px] text-[#9A9A9A]">
              Target : <span className="text-[#EDEDED] font-medium">{targetPercentage}%</span>
            </p>
            <p className="text-[13.5px] text-[#9A9A9A]">
              Current :{' '}
              <span className="text-[#8CFF57] font-semibold">
                {currentPercentage}%
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-full bg-[#FF6B2C] hover:bg-[#ff5814] active:scale-[0.98] transition-all text-white text-[13.5px] font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Subject</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkModal}
            className="w-full bg-[#277A10] hover:bg-[#20660c] active:scale-[0.98] transition-all text-white text-[13.5px] font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>All Class</span>
          </button>
        </div>
      </div>

      <AttendanceRecommendation recommendation={summary?.recommendation} />
    </div>
  );
};
