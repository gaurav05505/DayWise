import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Clock, Calendar } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const SubjectHistoryModal = ({
  isOpen,
  onClose,
  subject,
  onDeleteLog,
}) => {
  if (!subject) return null;

  const logs = subject.logs || [];
  const percentage = Math.round(subject.percentage ?? subject.attendancePercentage ?? 0);
  const target = subject.target || 75;
  const isHealthy = percentage >= target;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[390px] bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-[#55F130]/15 text-[#55F130] flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {subject.name}
                  </h3>
                  <p className="text-[11.5px] text-[#8A92A0]">
                    Attendance Log History
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-white/[0.06] shrink-0">
              <div className="bg-[#1B1E26] rounded-xl p-2 text-center">
                <span className="text-[10.5px] text-[#8A92A0] font-medium block">
                  Total
                </span>
                <span className="text-sm font-bold text-white">
                  {subject.totalClasses}
                </span>
              </div>
              <div className="bg-[#1B1E26] rounded-xl p-2 text-center">
                <span className="text-[10.5px] text-[#8A92A0] font-medium block">
                  Attended
                </span>
                <span className="text-sm font-bold text-[#4ADE80]">
                  {subject.attendedClasses}
                </span>
              </div>
              <div className="bg-[#1B1E26] rounded-xl p-2 text-center">
                <span className="text-[10.5px] text-[#8A92A0] font-medium block">
                  Current
                </span>
                <span
                  className={`text-sm font-bold ${
                    isHealthy ? 'text-[#4ADE80]' : 'text-[#EF4444]'
                  }`}
                >
                  {percentage}%
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 min-h-0 pr-0.5">
              {logs.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-[#6B7280] flex items-center justify-center mx-auto">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#8A92A0]">
                    No tap records found
                  </p>
                  <p className="text-[11px] text-[#6B7280] max-w-[200px] mx-auto">
                    Tap the ✓ or ✕ button on the card to record class attendance.
                  </p>
                </div>
              ) : (
                logs.map((log) => {
                  const isPresent = log.status === 'present';
                  const dateDisplay =
                    log.date ||
                    (log.timestamp
                      ? new Date(log.timestamp).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Unknown Date');

                  const timeDisplay =
                    log.time ||
                    (log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : '');

                  return (
                    <div
                      key={log._id || log.timestamp}
                      className="flex items-center justify-between bg-[#1B1E26] border border-white/[0.04] rounded-2xl p-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isPresent
                              ? 'bg-[#16A34A]/20 text-[#4ADE80]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {isPresent ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-white leading-snug">
                            {isPresent ? 'Done (Present)' : 'Not Done (Absent)'}
                          </p>
                          <p className="text-[11px] text-[#8A92A0]">
                            {timeDisplay}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-[11.5px] font-semibold text-[#D1D5DB]">
                          {dateDisplay}
                        </span>

                        {onDeleteLog && (
                          <button
                            type="button"
                            onClick={() => onDeleteLog(subject._id, log._id)}
                            aria-label="Delete entry"
                            className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.06] shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

