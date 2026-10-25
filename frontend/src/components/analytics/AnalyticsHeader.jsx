import React from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { PERIODS } from '../../services/analyticsService.js';

export const AnalyticsHeader = ({
  onBack,
  selectedPeriod,
  onSelectPeriod,
}) => {
  return (
    <header className="pt-3 pb-3 space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-[#1D1D1D] border border-white/[0.05] flex items-center justify-center text-[#9A9DA8] hover:text-white transition-colors cursor-pointer active:scale-95 shadow-sm shrink-0"
        >
          <ArrowLeft className="w-4.5 h-4.5 stroke-[2]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#F4F5F7] tracking-tight truncate">
              Attendance Analytics
            </h1>
            <div className="w-5 h-5 rounded-md bg-[#24D366]/10 text-[#24D366] flex items-center justify-center shrink-0">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-[12px] text-[#9A9DA8] font-medium truncate mt-0.5">
            Understand your attendance at a glance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-white/[0.05] rounded-2xl">
        {PERIODS.map((period) => {
          const isSelected = selectedPeriod === period.id;
          return (
            <button
              key={period.id}
              type="button"
              onClick={() => onSelectPeriod(period.id)}
              className={`flex-1 py-1.5 text-[11.5px] font-bold rounded-xl transition-all cursor-pointer text-center select-none ${
                isSelected
                  ? 'bg-[#1D1D1D] text-white shadow-sm border border-white/[0.08]'
                  : 'text-[#9A9DA8] hover:text-white'
              }`}
            >
              {period.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
