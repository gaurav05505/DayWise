import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Clock, MapPin, AlertCircle, BookOpen } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';
import { DAYS_OF_WEEK, timeToMinutes, formatTime12h } from '../../services/timetableService.js';

const parse24To12 = (time24 = '09:00') => {
  if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) {
    return { hour: '09', minute: '00', period: 'AM' };
  }
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) h = 9;
  const m = mStr ? mStr.padStart(2, '0') : '00';
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return {
    hour: String(h12).padStart(2, '0'),
    minute: m,
    period,
  };
};

const convert12To24 = (hour12, minute, period) => {
  let h = parseInt(hour12, 10);
  if (isNaN(h) || h < 1) h = 12;
  if (h > 12) h = 12;
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  const m = String(minute || '00').padStart(2, '0');
  return `${String(h).padStart(2, '0')}:${m}`;
};

const HOURS_LIST = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const BASE_MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const getMinutesList = (currentMin) => {
  if (currentMin && !BASE_MINUTES.includes(currentMin)) {
    return [...BASE_MINUTES, currentMin].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }
  return BASE_MINUTES;
};

export const AddTimetableModal = ({
  isOpen,
  onClose,
  onSave,
  initialDay = 'Monday',
  editingClass = null,
  dayClasses = [],
  subjectSuggestions = [],
}) => {
  const [subjectName, setSubjectName] = useState('');
  const [day, setDay] = useState(initialDay);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingClass) {
      setSubjectName(editingClass.subjectName || '');
      setDay(editingClass.day || initialDay);
      setStartTime(editingClass.startTime || '09:00');
      setEndTime(editingClass.endTime || '10:00');
      setRoom(editingClass.room || '');
    } else {
      setSubjectName('');
      setDay(initialDay || 'Monday');
      setStartTime('09:00');
      setEndTime('10:00');
      setRoom('');
    }
    setError('');
    setWarning('');
  }, [editingClass, initialDay, isOpen]);

  useEffect(() => {
    if (!startTime || !endTime) {
      setWarning('');
      return;
    }
    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(endTime);
    if (endM > startM) {
      const otherClasses = dayClasses.filter((c) => c._id !== editingClass?._id);
      const overlap = otherClasses.find((c) => {
        const cStart = timeToMinutes(c.startTime);
        const cEnd = timeToMinutes(c.endTime);
        return Math.max(startM, cStart) < Math.min(endM, cEnd);
      });
      if (overlap) {
        setWarning(
          `Notice: Overlaps with "${overlap.subjectName}" (${formatTime12h(overlap.startTime)} - ${formatTime12h(overlap.endTime)}).`
        );
      } else {
        setWarning('');
      }
    } else {
      setWarning('');
    }
  }, [startTime, endTime, dayClasses, editingClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subjectName.trim()) {
      setError('Subject name is required.');
      return;
    }

    if (!startTime) {
      setError('Start time is required.');
      return;
    }

    if (!endTime) {
      setError('End time is required.');
      return;
    }

    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(endTime);

    if (endM <= startM) {
      setError('End time must be later than start time.');
      return;
    }

    const otherClasses = dayClasses.filter((c) => c._id !== editingClass?._id);

    const duplicate = otherClasses.find(
      (c) =>
        c.subjectName.toLowerCase() === subjectName.trim().toLowerCase() &&
        c.startTime === startTime
    );
    if (duplicate) {
      setError(`A class for "${subjectName.trim()}" at ${formatTime12h(startTime)} already exists on ${day}.`);
      return;
    }

    const overlap = otherClasses.find((c) => {
      const cStart = timeToMinutes(c.startTime);
      const cEnd = timeToMinutes(c.endTime);
      return Math.max(startM, cStart) < Math.min(endM, cEnd);
    });

    if (overlap) {
      setError(`Overlaps with "${overlap.subjectName}" (${formatTime12h(overlap.startTime)} - ${formatTime12h(overlap.endTime)}). Please choose another time.`);
      return;
    }

    setSubmitting(true);
    const res = await onSave({
      subjectName: subjectName.trim(),
      day,
      startTime,
      endTime,
      room: room.trim(),
    });
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to save class schedule');
    }
  };

  const start12 = parse24To12(startTime);
  const end12 = parse24To12(endTime);

  const startMinutesList = getMinutesList(start12.minute);
  const endMinutesList = getMinutesList(end12.minute);

  const handleStartChange = (h, m, p) => {
    const new24 = convert12To24(h, m, p);
    setStartTime(new24);
    setError('');
  };

  const handleEndChange = (h, m, p) => {
    const new24 = convert12To24(h, m, p);
    setEndTime(new24);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-[390px] bg-[#181818] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-5 pb-7 sm:pb-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <CalendarPlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {editingClass ? 'Edit Schedule' : 'Add Subject Schedule'}
                  </h3>
                  <p className="text-[11px] text-[#8E95A5]">
                    {day} class timing & room
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

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-2xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {warning && !error && (
                <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs rounded-2xl p-2.5 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span className="leading-snug">{warning}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider block mb-1.5 px-0.5">
                  Subject Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => {
                      setSubjectName(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Mathematics, Physics, Programming"
                    className="w-full bg-[#181B24] border border-white/10 rounded-2xl px-3.5 py-3 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {subjectSuggestions.length > 0 && !editingClass && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 px-0.5">
                    <span className="text-[10px] text-[#8E95A5] flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Quick pick:
                    </span>
                    {subjectSuggestions.slice(0, 4).map((sub) => (
                      <button
                        key={sub._id || sub.name}
                        type="button"
                        onClick={() => setSubjectName(sub.name)}
                        className="text-[11px] bg-white/5 hover:bg-white/10 text-[#D1D5DB] hover:text-white px-2 py-0.5 rounded-lg border border-white/[0.04] transition-colors cursor-pointer"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider block mb-1.5 px-0.5">
                  Day of Week <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = day === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDay(d)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-zinc-950 shadow-sm'
                            : 'bg-[#181B24] text-[#8E95A5] hover:text-white border border-white/[0.04]'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <label className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatTime12h(startTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#181B24] border border-white/10 rounded-2xl p-1.5 focus-within:border-white/30 transition-colors">
                    <div className="flex items-center gap-1.5 pl-1">
                      <select
                        aria-label="Start hour"
                        value={start12.hour}
                        onChange={(e) =>
                          handleStartChange(e.target.value, start12.minute, start12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {HOURS_LIST.map((h) => (
                          <option key={h} value={h} className="bg-[#181B24] text-white">
                            {h}
                          </option>
                        ))}
                      </select>

                      <span className="text-white/60 font-bold text-base">:</span>

                      <select
                        aria-label="Start minute"
                        value={start12.minute}
                        onChange={(e) =>
                          handleStartChange(start12.hour, e.target.value, start12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {startMinutesList.map((m) => (
                          <option key={m} value={m} className="bg-[#181B24] text-white">
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex rounded-xl bg-black/40 border border-white/[0.06] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartChange(start12.hour, start12.minute, 'AM')
                        }
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          start12.period === 'AM'
                            ? 'bg-emerald-500 text-[#090A0F] shadow-sm scale-105'
                            : 'text-[#8E95A5] hover:text-white'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleStartChange(start12.hour, start12.minute, 'PM')
                        }
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          start12.period === 'PM'
                            ? 'bg-emerald-500 text-[#090A0F] shadow-sm scale-105'
                            : 'text-[#8E95A5] hover:text-white'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <label className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatTime12h(endTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#181B24] border border-white/10 rounded-2xl p-1.5 focus-within:border-white/30 transition-colors">
                    <div className="flex items-center gap-1.5 pl-1">
                      <select
                        aria-label="End hour"
                        value={end12.hour}
                        onChange={(e) =>
                          handleEndChange(e.target.value, end12.minute, end12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {HOURS_LIST.map((h) => (
                          <option key={h} value={h} className="bg-[#181B24] text-white">
                            {h}
                          </option>
                        ))}
                      </select>

                      <span className="text-white/60 font-bold text-base">:</span>

                      <select
                        aria-label="End minute"
                        value={end12.minute}
                        onChange={(e) =>
                          handleEndChange(end12.hour, e.target.value, end12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {endMinutesList.map((m) => (
                          <option key={m} value={m} className="bg-[#181B24] text-white">
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex rounded-xl bg-black/40 border border-white/[0.06] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleEndChange(end12.hour, end12.minute, 'AM')
                        }
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          end12.period === 'AM'
                            ? 'bg-emerald-500 text-[#090A0F] shadow-sm scale-105'
                            : 'text-[#8E95A5] hover:text-white'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleEndChange(end12.hour, end12.minute, 'PM')
                        }
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          end12.period === 'PM'
                            ? 'bg-emerald-500 text-[#090A0F] shadow-sm scale-105'
                            : 'text-[#8E95A5] hover:text-white'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8E95A5] uppercase tracking-wider block mb-1.5 px-0.5">
                  Room or Location <span className="text-[#8E95A5] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 304, Lab 2, Main Hall"
                    className="w-full bg-[#181B24] border border-white/10 rounded-2xl px-3.5 py-3 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-[#8E95A5] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#181B24] hover:bg-[#222634] text-[#8E95A5] hover:text-white text-xs font-semibold py-3.5 rounded-2xl transition-all cursor-pointer border border-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingClass ? 'Save Changes' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

