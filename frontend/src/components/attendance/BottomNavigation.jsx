import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Wallet, PiggyBank, Settings } from 'lucide-react';

export const BottomNavigation = ({ activeTab = 'attendance', onTabChange }) => {
  const tabs = [
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: Wallet,
    },
    {
      id: 'custom-budgets',
      label: 'Custom',
      icon: PiggyBank,
    },
    {
      id: 'more',
      label: 'More',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-[360px] mx-auto z-40">
      <nav className="w-full bg-[#14171E]/95 backdrop-blur-xl border border-white/[0.08] rounded-full h-[64px] px-3 flex items-center justify-around shadow-2xl shadow-black/80 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              type="button"
              aria-label={tab.label}
              onClick={() => onTabChange?.(tab.id)}
              whileTap={{ scale: 0.9 }}
              className="relative w-12 h-12 flex flex-col items-center justify-center cursor-pointer select-none rounded-full"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-1 rounded-full bg-[#FF6D1F] shadow-lg shadow-[#FF6D1F]/30"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  color: isActive ? '#FFFFFF' : '#8A92A0',
                }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                <Icon className="w-5 h-5 stroke-[2.3]" />
              </motion.div>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
