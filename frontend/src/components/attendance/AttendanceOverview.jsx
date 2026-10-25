import React from 'react';
import { Plus, Check } from 'lucide-react';

export const AttendanceOverview = ({
  summary,
  onOpenAddModal,
  onOpenBulkModal,
  onOpenAnalytics,
}) => {
  const currentPercentage = Math.round(
    summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
  );
  const targetPercentage = Math.round(
    summary?.targetAttendance ?? summary?.target ?? 75
  );
  const totalClasses = Number(summary?.totalClasses) || 0;
  const attendedClasses =
    Number(summary?.attendedClasses ?? summary?.totalAttendedClasses) || 0;

  const isHealthy =
    summary?.isTargetMet !== undefined
      ? summary.isTargetMet
      : totalClasses === 0
      ? true
      : attendedClasses * 100 >= targetPercentage * totalClasses;

  const canBunk = summary?.canBunk ?? 0;
  const needToAttend = summary?.needToAttend ?? 0;

  return (
    <section className="w-full bg-[#141414] border border-white/[0.05] rounded-[24px] p-3.5 sm:p-4 shadow-xl">
      <div className="grid grid-cols-2 gap-3 items-stretch">
        <div
          onClick={onOpenAnalytics}
          className="h-full bg-[#1D1D1D] hover:bg-[#222222] rounded-[18px] p-3.5 sm:p-4 flex flex-col justify-center space-y-2 cursor-pointer transition-colors active:scale-[0.99]"
        >
          <p className="text-[13.5px] text-[#F4F5F7] font-medium leading-tight">
            Target : <span className="font-bold">{targetPercentage}%</span>
          </p>
          <p className="text-[13.5px] text-[#F4F5F7] font-medium leading-tight">
            Current :{' '}
            <span
              className={`font-bold ${
                isHealthy ? 'text-[#24D366]' : 'text-[#F04444]'
              }`}
            >
              {currentPercentage}%
            </span>
          </p>
          <p className="text-[12.5px] text-[#F4F5F7] font-medium leading-tight pt-0.5">
            {isHealthy ? (
              canBunk > 0 ? (
                <span>
                  Can leave : <strong className="font-bold text-white">{canBunk} classes</strong>
                </span>
              ) : (
                <span>
                  Can leave : <strong className="font-bold text-white">0 classes</strong>
                </span>
              )
            ) : (
              <span>
                Need : <strong className="font-bold text-[#F04444]">{needToAttend} classes</strong>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-full flex-1 min-h-[46px] bg-[#16A34A] hover:bg-[#15803D] text-white text-[13px] font-bold rounded-[18px] flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Subject</span>
          </button>

          <button
            type="button"
            onClick={onOpenBulkModal}
            className="w-full flex-1 min-h-[46px] bg-[#1B2A1E] hover:bg-[#223526] text-[#E2E8F0] text-[13px] font-bold rounded-[18px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>All Class</span>
          </button>
        </div>
      </div>
    </section>
  );
};
