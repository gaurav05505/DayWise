import React from 'react';
import { Sparkles } from 'lucide-react';

export const AttendanceRecommendation = ({ recommendation }) => {
  return (
    <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
        <h3 className="text-[13.5px] font-bold text-white">
          Attendance Recommendation
        </h3>
      </div>
      <p className="text-[12.5px] text-[#D1D5DB] font-medium leading-relaxed">
        {recommendation || 'No classes recorded yet. Add subjects to see recommendations.'}
      </p>
    </div>
  );
};
