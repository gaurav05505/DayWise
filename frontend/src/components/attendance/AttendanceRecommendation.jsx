import React from 'react';

export const AttendanceRecommendation = ({ recommendation }) => {
  return (
    <div className="w-full bg-[#202020] border border-white/5 rounded-2xl p-4 mt-3">
      <h3 className="text-[14px] font-medium text-[#EDEDED] mb-1.5">
        Attendance Recommendation
      </h3>
      <p className="text-[12.5px] text-[#9A9A9A] leading-[18px]">
        {recommendation || 'No classes recorded yet.'}
      </p>
    </div>
  );
};

