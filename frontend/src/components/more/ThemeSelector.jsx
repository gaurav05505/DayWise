import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Monitor, Check } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: Moon, description: 'Default dark appearance' },
  { id: 'light', label: 'Light', icon: Sun, description: 'Light appearance' },
  { id: 'system', label: 'System', icon: Monitor, description: 'Sync with system setting' },
];

export const ThemeSelector = ({ isOpen, onClose, currentTheme = 'dark', onSelectTheme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-[360px] bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#55F130]/15 text-[#55F130] flex items-center justify-center">
                  <Moon className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-base font-bold text-white">Choose Theme</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {THEMES.map((t) => {
                const Icon = t.icon;
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(t.id);
                      onClose();
                    }}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1F29] border-[#55F130] text-white shadow-md'
                        : 'bg-[#1A1F29]/60 border-white/[0.06] text-[#8A92A0] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#55F130] text-[#090A0F] font-bold' : 'bg-[#14171E] text-[#8A92A0]'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#D1D5DB]'}`}>
                          {t.label}
                        </div>
                        <div className="text-[11px] text-[#8A92A0]">{t.description}</div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-5 h-5 text-[#55F130] stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
