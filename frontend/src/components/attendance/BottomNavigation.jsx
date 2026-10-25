import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart3, CalendarDays, User } from 'lucide-react';

const getNavPath = (idx, total = 4) => {
  const W = 352;
  const H = 64;
  const R = 22;
  const tabW = W / total;
  const cx = tabW / 2 + idx * tabW;
  const nw = 30;
  const nd = 36;
  const x1 = cx - nw;
  const x2 = cx + nw;

  return `M 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 L ${x1} 0 C ${cx - 16} 0 ${cx - 14} ${nd} ${cx} ${nd} C ${cx + 14} ${nd} ${cx + 16} 0 ${x2} 0 L ${W - R} 0 A ${R} ${R} 0 0 1 ${W} ${R} L ${W} ${H - R} A ${R} ${R} 0 0 1 ${W - R} ${H} L ${R} ${H} A ${R} ${R} 0 0 1 0 ${H - R} Z`;
};

export const BottomNavigation = ({ activeTab = 'attendance', onTabChange }) => {
  const tabs = [
    {
      id: 'attendance',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: CalendarDays,
    },
    {
      id: 'more',
      label: 'Profile',
      icon: User,
    },
  ];

  const effectiveTab = activeTab === 'customize' ? 'more' : activeTab;
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === effectiveTab));
  const ActiveIcon = tabs[activeIndex]?.icon || Home;

  return (
    <div className="fixed bottom-5 left-0 right-0 px-4 max-w-[370px] mx-auto z-40 pointer-events-auto select-none">
      <nav className="w-full h-[64px] relative flex items-center">
        <svg
          viewBox="0 0 352 64"
          className="absolute inset-0 w-full h-full overflow-visible drop-shadow-2xl"
        >
          <motion.path
            initial={false}
            animate={{ d: getNavPath(activeIndex, tabs.length) }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 24,
              mass: 0.8,
            }}
            fill="#181818"
          />
        </svg>

        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center z-20"
          style={{ width: `${100 / tabs.length}%` }}
          initial={false}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            mass: 0.8,
          }}
        >
          <motion.div
            className="absolute top-[4px] w-[46px] h-[46px] rounded-full bg-emerald-500 shadow-lg shadow-emerald-950/50 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => onTabChange?.(tabs[activeIndex].id)}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={effectiveTab}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <ActiveIcon className="w-5 h-5 text-white stroke-[2.3]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="w-full h-full flex items-center relative z-10">
          {tabs.map((tab, idx) => {
            const isActive = activeIndex === idx;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                aria-label={tab.label}
                onClick={() => onTabChange?.(tab.id)}
                style={{ width: `${100 / tabs.length}%` }}
                className="h-full flex flex-col items-center justify-center cursor-pointer relative focus:outline-none"
              >
                <motion.div
                  animate={{
                    opacity: isActive ? 0 : 1,
                    scale: isActive ? 0.6 : 1,
                  }}
                  transition={{ duration: 0.18 }}
                  className="text-[#8E95A5] hover:text-white transition-colors flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </motion.div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
