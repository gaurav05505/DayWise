import React from 'react';

export const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5" />
              <div className="space-y-1.5">
                <div className="w-28 h-3.5 bg-white/10 rounded-md" />
                <div className="w-16 h-2.5 bg-white/5 rounded-md" />
              </div>
            </div>
            <div className="w-12 h-6 bg-white/5 rounded-full" />
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
};
