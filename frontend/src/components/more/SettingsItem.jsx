import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SettingsItem = ({
  icon: Icon,
  iconColor = '#FF6D1F',
  title,
  subtitle,
  value,
  isDestructive = false,
  showChevron = true,
  onClick,
  trailing,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
        isDestructive
          ? 'hover:bg-[#EF4444]/5 active:bg-[#EF4444]/10'
          : 'hover:bg-white/5 active:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3.5 pr-2 min-w-0">
        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#1A1F29]'
            }`}
            style={!isDestructive ? { color: iconColor } : undefined}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <div
            className={`text-sm font-bold truncate ${
              isDestructive ? 'text-[#EF4444]' : 'text-white'
            }`}
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-[11.5px] text-[#8A92A0] truncate mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {value !== undefined && (
          <span className="text-xs font-semibold text-[#8A92A0]">{value}</span>
        )}
        {trailing}
        {showChevron && !trailing && (
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        )}
      </div>
    </button>
  );
};
