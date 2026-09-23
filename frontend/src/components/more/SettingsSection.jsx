import React from 'react';

export const SettingsSection = ({ title, children }) => {
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider px-1">
          {title}
        </h3>
      )}
      <div className="w-full bg-[#14161B] border border-white/[0.04] rounded-[28px] divide-y divide-white/[0.04] overflow-hidden shadow-xl">
        {children}
      </div>
    </div>
  );
};
