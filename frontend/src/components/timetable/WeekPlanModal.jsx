import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Layers,
  Copy,
  Plus,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  Repeat,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';
import { DAYS_OF_WEEK, formatTime12h } from '../../services/timetableService.js';

export const WeekPlanModal = ({
  isOpen,
  onClose,
  allClasses = [],
  weeklySummary = null,
  onOpenAddModal,
  onCopyDaySchedule,
  onSelectDay,
}) => {
  const [activeTab, setActiveTab] = useState('days');
  const [isCopying, setIsCopying] = useState(false);
  const [sourceDay, setSourceDay] = useState('Monday');
  const [targetDays, setTargetDays] = useState([]);
  const [copyOverwrite, setCopyOverwrite] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

  if (!isOpen) return null;

  const summary = weeklySummary || {
    totalClasses: allClasses.length,
    activeDaysCount: 0,
    byDay: {},
    subjects: [],
  };

  const daysWithClasses = DAYS_OF_WEEK.filter(
    (d) => summary.byDay[d] && summary.byDay[d].length > 0
  );

  const handleStartCopy = (dayName) => {
    setSourceDay(dayName || daysWithClasses[0] || 'Monday');
    setTargetDays([]);
    setCopyStatus(null);
    setIsCopying(true);
  };

  const toggleTargetDay = (d) => {
    if (d === sourceDay) return;
    if (targetDays.includes(d)) {
      setTargetDays(targetDays.filter((x) => x !== d));
    } else {
      setTargetDays([...targetDays, d]);
    }
  };

  const handleExecuteCopy = async () => {
    if (targetDays.length === 0) {
      setCopyStatus({ type: 'error', message: 'Select at least one day to copy to.' });
      return;
    }
    setCopyStatus({ type: 'loading', message: 'Copying schedule...' });
    const res = await onCopyDaySchedule(sourceDay, targetDays, copyOverwrite);
    if (res?.success) {
      setCopyStatus({
        type: 'success',
        message: `Successfully copied to ${targetDays.length} day${targetDays.length === 1 ? '' : 's'}!`,
      });
      setTimeout(() => {
        setIsCopying(false);
        setCopyStatus(null);
      }, 1400);
    } else {
      setCopyStatus({ type: 'error', message: res?.error || 'Failed to copy schedule.' });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-[390px] bg-[#1D1D1D] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-5 pb-7 sm:pb-6 shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full aspect-square bg-[#24D366]/10 text-[#24D366] border border-[#24D366]/20 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 shrink-0" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Week Schedule Plan
                </h3>
                <p className="text-[11px] text-[#9A9DA8]">
                  Weekly recurring routine & timetable
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full aspect-square bg-white/5 hover:bg-white/10 text-[#9A9DA8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/[0.05] shrink-0">
            <div className="bg-black/30 border border-white/[0.04] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] text-[#9A9DA8] font-semibold uppercase tracking-wider">
                Total Classes
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {summary.totalClasses}
              </p>
            </div>
            <div className="bg-black/30 border border-white/[0.04] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] text-[#9A9DA8] font-semibold uppercase tracking-wider">
                Active Days
              </p>
              <p className="text-base font-bold text-[#24D366] mt-0.5">
                {summary.activeDaysCount} <span className="text-[11px] text-[#9A9DA8] font-normal">/ 7</span>
              </p>
            </div>
            <div className="bg-black/30 border border-white/[0.04] rounded-2xl p-2.5 text-center">
              <p className="text-[10px] text-[#9A9DA8] font-semibold uppercase tracking-wider">
                Subjects
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                {summary.subjects.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 pb-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddModal?.();
              }}
              className="flex-1 bg-[#24D366] hover:bg-[#16A34A] text-[#0B0C0F] text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Week Subject</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartCopy()}
              className="bg-white/[0.05] hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-[#24D366]" />
              <span>Copy Day</span>
            </button>
          </div>

          {isCopying && (
            <div className="p-3.5 bg-black/40 border border-[#24D366]/30 rounded-2xl space-y-3 mb-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-[#24D366]" />
                  <span>Copy Day Routine</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCopying(false)}
                  className="text-[11px] text-[#9A9DA8] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[10px] text-[#9A9DA8] font-semibold uppercase tracking-wider block mb-1">
                  Copy from:
                </label>
                <select
                  value={sourceDay}
                  onChange={(e) => {
                    setSourceDay(e.target.value);
                    setTargetDays(targetDays.filter((d) => d !== e.target.value));
                  }}
                  className="w-full bg-[#1D1D1D] text-white text-xs font-bold rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-[#24D366] cursor-pointer"
                >
                  {DAYS_OF_WEEK.map((d) => {
                    const count = summary.byDay[d]?.length || 0;
                    return (
                      <option key={d} value={d}>
                        {d} ({count} class{count === 1 ? '' : 'es'})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9A9DA8] font-semibold uppercase tracking-wider block mb-1">
                  Copy to Days:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DAYS_OF_WEEK.filter((d) => d !== sourceDay).map((d) => {
                    const isSelected = targetDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleTargetDay(d)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#24D366] text-[#0B0C0F] border-[#24D366]'
                            : 'bg-white/[0.04] text-[#9A9DA8] hover:text-white border-white/[0.04]'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#9A9DA8]">
                  <input
                    type="checkbox"
                    checked={copyOverwrite}
                    onChange={(e) => setCopyOverwrite(e.target.checked)}
                    className="accent-[#24D366] w-3.5 h-3.5 rounded"
                  />
                  <span>Replace existing classes</span>
                </label>

                <button
                  type="button"
                  onClick={handleExecuteCopy}
                  className="bg-[#24D366] hover:bg-[#16A34A] text-[#0B0C0F] text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  Apply Copy
                </button>
              </div>

              {copyStatus && (
                <div
                  className={`text-xs p-2 rounded-xl text-center ${
                    copyStatus.type === 'error'
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {copyStatus.message}
                </div>
              )}
            </div>
          )}

          <div className="flex border-b border-white/[0.06] shrink-0 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('days')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'days'
                  ? 'border-[#24D366] text-white'
                  : 'border-transparent text-[#9A9DA8] hover:text-white'
              }`}
            >
              Days Routine ({summary.activeDaysCount}/7)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'subjects'
                  ? 'border-[#24D366] text-white'
                  : 'border-transparent text-[#9A9DA8] hover:text-white'
              }`}
            >
              Subjects ({summary.subjects.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
            {activeTab === 'days' ? (
              DAYS_OF_WEEK.map((dayName) => {
                const dayClassesList = summary.byDay[dayName] || [];
                const hasClasses = dayClassesList.length > 0;

                return (
                  <div
                    key={dayName}
                    className="p-3 bg-black/25 border border-white/[0.04] rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            hasClasses ? 'bg-[#24D366]' : 'bg-white/20'
                          }`}
                        />
                        <span className="text-xs font-bold text-white">
                          {dayName}
                        </span>
                        <span className="text-[10px] text-[#9A9DA8] bg-white/[0.04] px-1.5 py-0.5 rounded-md">
                          {dayClassesList.length} class{dayClassesList.length === 1 ? '' : 'es'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {hasClasses && (
                          <button
                            type="button"
                            onClick={() => handleStartCopy(dayName)}
                            title="Copy this day schedule"
                            className="p-1 text-[#9A9DA8] hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectDay?.(dayName);
                          }}
                          className="text-[10.5px] font-semibold text-[#24D366] hover:underline px-1.5 py-0.5"
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {hasClasses ? (
                      <div className="space-y-1.5 pt-1">
                        {dayClassesList.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between text-xs bg-[#1D1D1D] border border-white/[0.04] rounded-xl px-2.5 py-2"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-white truncate text-[12px]">
                                {item.subjectName}
                              </p>
                              {item.room && (
                                <p className="text-[10px] text-[#9A9DA8] truncate">
                                  {item.room}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-[#24D366] shrink-0">
                              {formatTime12h(item.startTime)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#9A9DA8]/60 italic py-0.5">
                        No classes scheduled for {dayName}
                      </p>
                    )}
                  </div>
                );
              })
            ) : summary.subjects.length === 0 ? (
              <div className="p-8 text-center text-[#9A9DA8] space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-white/20" />
                <p className="text-xs">No subjects scheduled in the week yet.</p>
              </div>
            ) : (
              summary.subjects.map((sub) => (
                <div
                  key={sub.name}
                  className="p-3 bg-black/25 border border-white/[0.04] rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">
                      {sub.name}
                    </h4>
                    <span className="text-[10px] font-bold text-[#24D366] bg-[#24D366]/10 border border-[#24D366]/20 px-2 py-0.5 rounded-full">
                      {sub.daysCount} {sub.daysCount === 1 ? 'day' : 'days'} / week
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {sub.days.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-bold bg-[#1D1D1D] border border-white/[0.06] text-white px-2 py-0.5 rounded-md"
                      >
                        {d.substring(0, 3)}
                      </span>
                    ))}
                  </div>

                  {sub.sampleTime && (
                    <div className="flex items-center gap-3 text-[11px] text-[#9A9DA8] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#9A9DA8]" />
                        {sub.sampleTime}
                      </span>
                      {sub.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#24D366]" />
                          {sub.room}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

