import React from 'react';
import { Wallet, Timer, User } from 'lucide-react';

export const BottomNavigation = ({ activeTab = 'attendance', onTabChange }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-[360px] mx-auto z-40">
      <nav className="w-full bg-[#181818]/95 backdrop-blur-md border border-white/5 rounded-full h-[62px] px-3 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          aria-label="Attendance"
          onClick={() => onTabChange?.('attendance')}
          className={`transition-all active:scale-95 cursor-pointer ${
            activeTab === 'attendance'
              ? 'w-[42px] h-[42px] rounded-full bg-[#FF6B2C] text-white flex flex-col items-center justify-center shadow-lg'
              : 'w-10 h-10 flex items-center justify-center text-[#7E7E7E] hover:text-[#EDEDED]'
          }`}
        >
          <div className="w-[18px] h-[18px] border-[1.75px] border-current rounded-[4px] relative flex flex-col items-center justify-center pt-0.5">
            <div className="absolute -top-[3px] left-1 w-0.5 h-1 bg-current rounded-sm" />
            <div className="absolute -top-[3px] right-1 w-0.5 h-1 bg-current rounded-sm" />
            <span className="text-[8px] font-bold leading-none">18</span>
          </div>
        </button>

        <button
          type="button"
          aria-label="Budget"
          onClick={() => onTabChange?.('budget')}
          className={`transition-all active:scale-95 cursor-pointer ${
            activeTab === 'budget'
              ? 'w-[42px] h-[42px] rounded-full bg-[#FF6B2C] text-white flex items-center justify-center shadow-lg'
              : 'w-10 h-10 flex items-center justify-center text-[#7E7E7E] hover:text-[#EDEDED]'
          }`}
        >
          <Wallet className="w-[21px] h-[21px]" />
        </button>

        <button
          type="button"
          aria-label="Timer"
          onClick={() => onTabChange?.('timer')}
          className="w-10 h-10 flex items-center justify-center text-[#7E7E7E] hover:text-[#EDEDED] transition-colors active:scale-95 cursor-pointer"
        >
          <Timer className="w-[21px] h-[21px]" />
        </button>

        <button
          type="button"
          aria-label="Profile"
          onClick={() => onTabChange?.('profile')}
          className="w-10 h-10 flex items-center justify-center text-[#7E7E7E] hover:text-[#EDEDED] transition-colors active:scale-95 cursor-pointer"
        >
          <User className="w-[21px] h-[21px]" />
        </button>
      </nav>
    </div>
  );
};
