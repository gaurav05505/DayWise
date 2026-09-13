import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const EditSubjectModal = ({ isOpen, onClose, subject, onUpdateSubject }) => {
  const [name, setName] = useState('');
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (subject && isOpen) {
      setName(subject.name || '');
      setTotalClasses(subject.totalClasses ?? 0);
      setAttendedClasses(subject.attendedClasses ?? 0);
      setError('');
    }
  }, [subject, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    const total = Number(totalClasses);
    const attended = Number(attendedClasses);

    if (total < 0 || attended < 0) {
      setError('Class counts cannot be negative');
      return;
    }

    if (attended > total) {
      setError('Attended classes cannot exceed total classes');
      return;
    }

    setSubmitting(true);
    const res = await onUpdateSubject(subject._id, {
      name: name.trim(),
      totalClasses: total,
      attendedClasses: attended,
    });
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to update subject');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && subject && (
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
                <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center">
                  <Pencil className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Edit Subject
                </h3>
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
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-3 my-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  required
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(e.target.value)}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                    Attended Classes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(e.target.value)}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#FF6D1F] hover:bg-[#E85C0D] disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#FF6D1F]/20 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
