import React, { useState, useEffect } from 'react';
import { X, Check, Minus } from 'lucide-react';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[360px] max-h-[85vh] flex flex-col bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h3 className="text-[16px] font-semibold text-[#EDEDED]">
              Mark Daily Attendance
            </h3>
            <p className="text-[12px] text-[#9A9A9A]">
              Select status for today's classes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-lg p-2.5 mb-3 shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2">
            {subjects.length === 0 ? (
              <p className="text-[13px] text-[#888888] text-center py-4">
                No subjects available.
              </p>
            ) : (
              subjects.map((s) => {
                const current = selections[s._id] || 'none';
                return (
                  <div
                    key={s._id}
                    className="flex items-center justify-between bg-[#222222] border border-white/5 rounded-xl p-3"
                  >
                    <span className="text-[13.5px] font-medium text-[#EDEDED] truncate max-w-[130px]">
                      {s.name}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggle(s._id, 'present')}
                        className={`px-2.5 py-1 text-[12px] font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          current === 'present'
                            ? 'bg-[#1A7909] text-white'
                            : 'bg-[#2A2A2A] text-[#888888] hover:text-white'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(s._id, 'absent')}
                        className={`px-2.5 py-1 text-[12px] font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          current === 'absent'
                            ? 'bg-[#B90F14] text-white'
                            : 'bg-[#2A2A2A] text-[#888888] hover:text-white'
                        }`}
                      >
                        <X className="w-3 h-3 stroke-[2.5]" />
                        <span>Absent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(s._id, 'none')}
                        className={`p-1 text-[12px] rounded-lg transition-all cursor-pointer ${
                          current === 'none'
                            ? 'bg-white/10 text-white'
                            : 'text-[#666666] hover:text-white'
                        }`}
                        title="No Class / Skip"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-white/5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#282828] hover:bg-[#323232] text-[#9A9A9A] text-[13px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || subjects.length === 0}
              className="flex-1 bg-[#277A10] hover:bg-[#20660c] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

