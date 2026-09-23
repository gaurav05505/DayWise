import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Palette, Sparkles, Check } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

const PRESET_TARGETS = [70, 75, 80, 85, 90];

export const AttendanceTargetModal = ({
  isOpen,
  onClose,
  currentTarget = 75,
  currentProgressColor = '#55F130',
  currentShowRecommendations = true,
  onSavePreferences,
  onSaveTarget,
}) => {
  const [selected, setSelected] = useState(currentTarget);
  const [customValue, setCustomValue] = useState('');
  const [cardColor, setCardColor] = useState(currentProgressColor);
  const [showRecs, setShowRecs] = useState(currentShowRecommendations);

  useEffect(() => {
    setSelected(currentTarget);
    if (!PRESET_TARGETS.includes(Number(currentTarget))) {
      setCustomValue(String(currentTarget));
    } else {
      setCustomValue('');
    }
    setCardColor(currentProgressColor || '#55F130');
    setShowRecs(currentShowRecommendations !== false);
  }, [currentTarget, currentProgressColor, currentShowRecommendations, isOpen]);

  const handlePresetSelect = (val) => {
    setSelected(val);
    setCustomValue('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0 && num <= 100) {
      setSelected(num);
    }
  };

  const handleSave = () => {
    const targetToSave = Number(selected) || 75;
    if (onSavePreferences) {
      onSavePreferences({
        attendanceTarget: targetToSave,
        progressCardColor: cardColor,
        showRecommendations: showRecs,
      });
    } else if (onSaveTarget) {
      onSaveTarget(targetToSave);
    }
    onClose();
  };

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
            className="w-full max-w-[375px] max-h-[88vh] flex flex-col bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#55F130]/15 text-[#55F130] flex items-center justify-center">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-base font-bold text-white">Customize & Target</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Target Attendance (%)
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {PRESET_TARGETS.map((val) => {
                    const isSelected = selected === val && !customValue;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`py-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#55F130] border-[#55F130] text-[#090A0F] shadow-md shadow-[#55F130]/20'
                            : 'bg-[#1A1F29] border-white/[0.06] text-[#8A92A0] hover:border-white/20'
                        }`}
                      >
                        {val}%
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customValue}
                    onChange={handleCustomChange}
                    placeholder="Custom % (e.g. 78)"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#55F130] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A92A0] text-xs font-bold">
                    %
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Palette className="w-3.5 h-3.5 text-[#55F130]" />
                  <label className="text-xs font-bold text-white">
                    Progress Card Theme
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardColor('#55F130')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      cardColor === '#55F130'
                        ? 'bg-[#1A1F29] border-[#55F130] shadow-lg shadow-[#55F130]/10'
                        : 'bg-[#1A1F29]/50 border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-5 h-5 rounded-lg bg-[#55F130] shadow-sm" />
                      {cardColor === '#55F130' && (
                        <Check className="w-4 h-4 text-[#55F130] stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Vibrant Neon
                      </span>
                      <span className="text-[10px] text-[#8A92A0]">Hero Gradient</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardColor('#212121')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      cardColor === '#212121'
                        ? 'bg-[#1A1F29] border-[#55F130] shadow-lg shadow-[#55F130]/10'
                        : 'bg-[#1A1F29]/50 border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-5 h-5 rounded-lg bg-[#212121] border border-white/20 shadow-sm" />
                      {cardColor === '#212121' && (
                        <Check className="w-4 h-4 text-[#55F130] stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Dark Charcoal
                      </span>
                      <span className="text-[10px] text-[#8A92A0]">Minimal Dark #212121</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-1 border-t border-white/[0.06]">
                <div className="flex items-center justify-between bg-[#1A1F29] border border-white/[0.06] p-3 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#55F130]/15 text-[#55F130] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Recommendations
                      </span>
                      <span className="text-[10px] text-[#8A92A0]">
                        Show smart skippable insights
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRecs((prev) => !prev)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      showRecs ? 'bg-[#55F130]' : 'bg-[#14171E] border border-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        showRecs ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2.5 shrink-0 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#1A1F29] hover:bg-[#222834] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-[#55F130] hover:bg-[#48D827] text-[#090A0F] text-xs font-bold shadow-md shadow-[#55F130]/20 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
