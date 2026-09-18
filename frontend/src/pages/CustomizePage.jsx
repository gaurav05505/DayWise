import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Palette, Sparkles, Check, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { useSettings } from '../hooks/useSettings.js';

const PRESET_TARGETS = [70, 75, 80, 85, 90];

export const CustomizePage = ({ onBack, onNavigate }) => {
  const { settings, updateMultipleSettings, toastMessage } = useSettings();

  const [target, setTarget] = useState(settings.attendanceTarget || 75);
  const [customTarget, setCustomTarget] = useState('');
  const [cardColor, setCardColor] = useState(settings.progressCardColor || '#FF6D1F');
  const [showRecs, setShowRecs] = useState(settings.showRecommendations !== false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setTarget(settings.attendanceTarget || 75);
    if (!PRESET_TARGETS.includes(Number(settings.attendanceTarget))) {
      setCustomTarget(String(settings.attendanceTarget));
    } else {
      setCustomTarget('');
    }
    setCardColor(settings.progressCardColor || '#FF6D1F');
    setShowRecs(settings.showRecommendations !== false);
  }, [settings]);

  const handlePresetSelect = (val) => {
    setTarget(val);
    setCustomTarget('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomTarget(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0 && num <= 100) {
      setTarget(num);
    }
  };

  const handleSave = async () => {
    const targetToSave = Number(target) || 75;
    await updateMultipleSettings({
      attendanceTarget: targetToSave,
      progressCardColor: cardColor,
      showRecommendations: showRecs,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 2500);
  };

  const isCharcoal = cardColor === '#212121';

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 px-4">
        {(toastMessage || savedToast) && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#14171E] border border-[#FF6D1F]/30 text-white text-xs py-2 px-4 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>{toastMessage || 'Preferences saved successfully!'}</span>
          </div>
        )}

        <PageTransition className="flex-1 flex flex-col">
          <header className="pt-4 pb-2 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="w-10 h-10 rounded-2xl bg-[#14171E] border border-white/[0.06] flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[11px] font-semibold text-[#FF6D1F] uppercase tracking-wider block">
                  Preferences
                </span>
                <h1 className="text-[17px] font-bold text-white tracking-tight">
                  Customize App
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-4 mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
                  Live Preview
                </span>
                <span className="text-[11px] text-[#8A92A0]">
                  {isCharcoal ? 'Dark Charcoal Style' : 'Vibrant Orange Style'}
                </span>
              </div>

              <div
                className={`w-full rounded-[28px] p-4 sm:p-5 text-white relative transition-all duration-300 ${
                  isCharcoal
                    ? 'bg-[#14171E] border border-white/[0.06] shadow-xl'
                    : 'bg-[#FF6D1F] shadow-xl shadow-[#FF6D1F]/15'
                }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCharcoal ? 'bg-[#FF6D1F]/15 text-[#FF6D1F]' : 'bg-black/15 text-white'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCharcoal ? 'text-white' : 'text-white/90'
                      }`}
                    >
                      Overall Progress
                    </span>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isCharcoal
                        ? 'bg-[#1A1F29] border border-white/[0.06] text-white'
                        : 'bg-black/15 text-white'
                    }`}
                  >
                    Target: {target}%
                  </div>
                </div>

                <div className="flex items-end justify-between relative z-10 my-4">
                  <div>
                    <div className="text-3xl font-black tracking-tight leading-none text-white">
                      85%
                    </div>
                    <p
                      className={`text-xs font-semibold mt-1 ${
                        isCharcoal ? 'text-[#8A92A0]' : 'text-white/80'
                      }`}
                    >
                      34 of 40 classes attended
                    </p>
                  </div>

                  <div
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm ${
                      isCharcoal
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : 'bg-[#090A0F] text-white'
                    }`}
                  >
                    On Track
                  </div>
                </div>

                <div
                  className={`w-full h-2.5 rounded-full overflow-hidden relative z-10 ${
                    isCharcoal ? 'bg-[#1A1F29] border border-white/[0.06]' : 'bg-black/20'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCharcoal ? 'bg-[#FF6D1F]' : 'bg-white'
                    }`}
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>

            <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-4 sm:p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Palette className="w-4.5 h-4.5 text-[#FF6D1F]" />
                <h3 className="text-sm font-bold text-white">
                  Progress Box Theme
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCardColor('#FF6D1F')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    cardColor === '#FF6D1F'
                      ? 'bg-[#1A1F29] border-[#FF6D1F] shadow-lg shadow-[#FF6D1F]/10'
                      : 'bg-[#1A1F29]/40 border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-6 h-6 rounded-xl bg-[#FF6D1F] shadow-sm flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    {cardColor === '#FF6D1F' && (
                      <Check className="w-4.5 h-4.5 text-[#FF6D1F] stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Vibrant Orange
                    </span>
                    <span className="text-[11px] text-[#8A92A0] mt-0.5 block">
                      Hero Orange Theme
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCardColor('#212121')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    cardColor === '#212121'
                      ? 'bg-[#1A1F29] border-[#FF6D1F] shadow-lg shadow-[#FF6D1F]/10'
                      : 'bg-[#1A1F29]/40 border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-6 h-6 rounded-xl bg-[#14171E] border border-white/20 shadow-sm flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#FF6D1F]" />
                    </div>
                    {cardColor === '#212121' && (
                      <Check className="w-4.5 h-4.5 text-[#FF6D1F] stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Dark Gray
                    </span>
                    <span className="text-[11px] text-[#8A92A0] mt-0.5 block">
                      Website Dark Theme
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-4 sm:p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Target className="w-4.5 h-4.5 text-[#FF6D1F]" />
                <h3 className="text-sm font-bold text-white">
                  Target Attendance Threshold
                </h3>
              </div>

              <div>
                <p className="text-xs text-[#8A92A0] mb-3 leading-relaxed">
                  Choose your minimum attendance percentage requirement. This governs target tracking and skippable class calculators.
                </p>

                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_TARGETS.map((val) => {
                    const isSelected = target === val && !customTarget;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF6D1F] border-[#FF6D1F] text-white shadow-md shadow-[#FF6D1F]/20'
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
                    value={customTarget}
                    onChange={handleCustomChange}
                    placeholder="Custom target % (e.g. 78)"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A92A0] text-xs font-bold">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-4 sm:p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Sparkles className="w-4.5 h-4.5 text-[#FF6D1F]" />
                <h3 className="text-sm font-bold text-white">
                  Smart Recommendations
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <span className="text-xs font-bold text-white block">
                    Show Smart Insights
                  </span>
                  <span className="text-xs text-[#8A92A0] mt-0.5 block leading-relaxed">
                    Display actionable cards showing how many classes you can skip while staying safe.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRecs((prev) => !prev)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                    showRecs ? 'bg-[#FF6D1F]' : 'bg-[#1A1F29] border border-white/10'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transition-transform ${
                      showRecs ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-3.5 rounded-2xl shadow-lg shadow-[#FF6D1F]/20 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save All Preferences</span>
            </button>
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

