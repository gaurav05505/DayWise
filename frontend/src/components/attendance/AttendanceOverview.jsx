import React from 'react';
import { Plus, Check } from 'lucide-react';

export const AttendanceOverview = ({
  summary,
  onOpenAddModal,
  onOpenBulkModal,
  showRecommendations = true,
}) => {
  const currentPercentage = Math.round(
    summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
  );
  const targetPercentage = Math.round(
    summary?.targetAttendance ?? summary?.target ?? 75
  );
  const isHealthy = currentPercentage >= targetPercentage;

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const dateStr = `${day} ${month}`;

  const recommendationText = summary?.recommendation || (
    isHealthy
      ? `You may miss classes and still maintain ${targetPercentage}% attendance.`
      : `You need to attend upcoming classes to reach ${targetPercentage}% attendance.`
  );

  return (
    <div className="w-full bg-[#14161B] border border-white/[0.04] rounded-[28px] p-3.5 sm:p-4 space-y-3 shadow-xl">
      <div className="flex gap-3">
        <div className="flex-1 bg-[#1B1E26] rounded-2xl p-3.5 flex flex-col justify-between">
          <span className="text-[13px] text-[#8A92A0] font-medium block">
            {dateStr}
          </span>
          <div className="space-y-1 mt-3">
            <p className="text-[13px] text-white font-medium">
              Target : <span className="font-bold">{targetPercentage}%</span>
            </p>
            <p className="text-[13px] text-white font-medium">
              Current :{' '}
              <span
                className={`font-bold ${
                  isHealthy ? 'text-[#4ADE80]' : 'text-[#EF4444]'
                }`}
              >
                {currentPercentage}%
              </span>
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-full bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6D1F]/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Subject</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkModal}
            className="w-full bg-[#2E7D1F] hover:bg-[#256B18] text-white text-xs font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-[#2E7D1F]/20 transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>All Class</span>
          </button>
        </div>
      </div>

      {showRecommendations && (
        <div className="w-full bg-[#1B1E26] rounded-2xl p-3.5 space-y-1">
          <h3 className="text-[13.5px] font-bold text-white">
            Attendance Recommendation
          </h3>
          <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed font-normal">
            {recommendationText}
          </p>
        </div>
      )}
    </div>
  );
};
