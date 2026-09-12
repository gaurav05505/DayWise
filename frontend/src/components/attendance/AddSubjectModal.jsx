import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddSubjectModal = ({ isOpen, onClose, onAddSubject }) => {
  const [name, setName] = useState('');
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

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
    const res = await onAddSubject({
      name: name.trim(),
      totalClasses: total,
      attendedClasses: attended,
    });
    setSubmitting(false);

    if (res?.success) {
      setName('');
      setTotalClasses(0);
      setAttendedClasses(0);
      onClose();
    } else {
      setError(res?.error || 'Failed to add subject');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[340px] bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#EDEDED]">
            Add Subject
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-lg p-2.5 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#9A9A9A] mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maths"
              required
              className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13.5px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#9A9A9A] mb-1">
                Total Classes
              </label>
              <input
                type="number"
                min="0"
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13.5px] text-[#EDEDED] focus:outline-none focus:border-[#FF6B2C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#9A9A9A] mb-1">
                Attended Classes
              </label>
              <input
                type="number"
                min="0"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
                className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13.5px] text-[#EDEDED] focus:outline-none focus:border-[#FF6B2C] transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#282828] hover:bg-[#323232] text-[#9A9A9A] text-[13px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#FF6B2C] hover:bg-[#ff550f] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {submitting ? 'Adding...' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

