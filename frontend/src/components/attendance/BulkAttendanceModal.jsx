import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, CheckCheck } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const BulkAttendanceModal = ({
  isOpen,
  onClose,
  subjects,
  onMarkBulkAttendance,
}) => {
  const [selections, setSelections] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && subjects.length > 0) {
      const initial = {};
      subjects.forEach((s) => {
        initial[s._id] = 'present';
      });
      setSelections(initial);
      setError('');
    }
  }, [isOpen, subjects]);

  const handleToggle = (id, status) => {
    setSelections((prev) => ({
      ...prev,
      [id]: prev[id] === status ? 'none' : status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const attendanceList = [];
    Object.entries(selections).forEach(([subjectId, status]) => {
      if (status === 'present' || status === 'absent') {
        attendanceList.push({ subjectId, status });
      }
    });

    if (attendanceList.length === 0) {
      setError('Please select attendance for at least one subject');
      return;
    }

    setSubmitting(true);
    const res = await onMarkBulkAttendance(attendanceList);
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to mark attendance');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-[360px] max-h-[85vh] flex flex-col bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                  <CheckCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Daily Classes
                  </h3>
                  <p className="text-[11px] text-[#8A92A0]">
                    Select today's attendance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 my-2 shrink-0">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 mt-2">
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2">
                {subjects.length === 0 ? (
                  <p className="text-xs text-[#8A92A0] text-center py-4">
                    No subjects available.
                  </p>
                ) : (
                  subjects.map((s) => {
                    const current = selections[s._id] || 'none';
                    return (
                      <div
                        key={s._id}
                        className="flex items-center justify-between bg-[#1A1F29] border border-white/[0.06] rounded-2xl p-3"
                      >
                        <span className="text-xs font-bold text-white truncate max-w-[130px]">
                          {s.name}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggle(s._id, 'present')}
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                              current === 'present'
                                ? 'bg-[#10B981] text-white shadow-sm'
                                : 'bg-[#14171E] text-[#8A92A0] hover:text-white'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggle(s._id, 'absent')}
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                              current === 'absent'
                                ? 'bg-[#EF4444] text-white shadow-sm'
                                : 'bg-[#14171E] text-[#8A92A0] hover:text-white'
                            }`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggle(s._id, 'none')}
                            className={`p-1.5 text-xs rounded-xl transition-all cursor-pointer ${
                              current === 'none'
                                ? 'bg-white/10 text-white'
                                : 'text-[#525B6D] hover:text-white'
                            }`}
                            title="Skip"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || subjects.length === 0}
                  className="flex-1 bg-[#55F130] hover:bg-[#48D827] disabled:opacity-50 text-[#090A0F] text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#55F130]/20 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Submit All'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
