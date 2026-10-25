import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Sparkles, Layers } from 'lucide-react';
import { pinAttendanceWidgetToHomeScreen } from '../../plugins/widgetBridge.js';

export const AddWidgetModal = ({ isOpen, onClose, summary }) => {
  const [isPinning, setIsPinning] = useState(false);
  const [pinnedSuccess, setPinnedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPercentage = Math.round(
    summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
  );
  const targetPercentage = Math.round(
    summary?.targetAttendance ?? summary?.target ?? 75
  );
  const attendedClasses = summary?.totalAttendedClasses ?? summary?.attendedClasses ?? 0;
  const totalClasses = summary?.totalClasses ?? 0;
  const canBunk = summary?.canBunk ?? 0;
  const needToAttend = summary?.needToAttend ?? 0;

  const handlePin = async () => {
    setIsPinning(true);
    try {
      const res = await pinAttendanceWidgetToHomeScreen();
      if (res?.success || res?.supported) {
        setPinnedSuccess(true);
        setTimeout(() => {
          setPinnedSuccess(false);
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPinning(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 w-full max-w-[390px] bg-[#0C0D10] border border-white/[0.08] rounded-t-[32px] sm:rounded-[32px] p-5 pb-8 sm:pb-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Stealth Home Widget
                </h3>
                <p className="text-[11px] text-[#8E95A5]">
                  Mark present directly from your home screen
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#8E95A5] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider px-1">
              Monochrome Widget Preview
            </span>

            <div className="w-full bg-[#121318] border border-white/[0.08] rounded-[24px] p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#22242C] text-white text-[10px] font-bold flex items-center justify-center">
                    DW
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    DayWise
                  </span>
                  <span className="text-[11px] text-[#8E95A5]">· Attendance</span>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-white text-zinc-950 text-[10px] font-bold shadow-sm">
                  + Mark Present
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {currentPercentage}%
                    </span>
                    <span className="text-xs font-bold text-[#8E95A5]">
                      / {targetPercentage}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8E95A5]">
                    {attendedClasses} of {totalClasses} classes attended
                  </p>
                </div>

                <div className="flex-1 max-w-[130px] space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-[#22242C] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${Math.min(100, Math.max(0, currentPercentage))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-[#8E95A5] leading-tight">
                    {canBunk > 0
                      ? `Can miss ${canBunk} class${canBunk > 1 ? 'es' : ''}`
                      : needToAttend > 0
                      ? `Attend ${needToAttend} class${needToAttend > 1 ? 'es' : ''}`
                      : `On track with target`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handlePin}
              disabled={isPinning}
              className="w-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>
                {pinnedSuccess ? 'Widget Added to Home Screen!' : 'Add Widget to Home Screen'}
              </span>
            </button>

            <div className="p-3.5 bg-[#121318] border border-white/[0.04] rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Layers className="w-3.5 h-3.5 text-[#8E95A5]" />
                <span>How to Add from Home Screen:</span>
              </div>
              <ol className="text-[11px] text-[#8E95A5] space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Long press empty space on your phone home screen.</li>
                <li>Tap <strong className="text-white">Widgets</strong>.</li>
                <li>Select <strong className="text-white">DayWise</strong>.</li>
                <li>Drag the Stealth Attendance widget to place it!</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

