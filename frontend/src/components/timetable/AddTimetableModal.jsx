import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, Clock, MapPin, AlertCircle, BookOpen, Repeat } from 'lucide-react';
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
  const [selectedDays, setSelectedDays] = useState([initialDay || 'Monday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingClass) {
      setSubjectName(editingClass.subjectName || '');
      setSelectedDays([editingClass.day || initialDay || 'Monday']);
      setStartTime(editingClass.startTime || '09:00');
      setEndTime(editingClass.endTime || '10:00');
      setRoom(editingClass.room || '');
    } else {
      setSubjectName('');
      setSelectedDays([initialDay || 'Monday']);
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
          `Notice: Overlaps on ${initialDay} with "${overlap.subjectName}" (${formatTime12h(overlap.startTime)} - ${formatTime12h(overlap.endTime)}).`
        );
      } else {
        setWarning('');
      }
    } else {
      setWarning('');
    }
  }, [startTime, endTime, dayClasses, editingClass, initialDay]);

  const toggleDay = (d) => {
    if (editingClass) {
      setSelectedDays([d]);
      return;
    }
    if (selectedDays.includes(d)) {
      if (selectedDays.length === 1) return;
      setSelectedDays(selectedDays.filter((x) => x !== d));
    } else {
      setSelectedDays([...selectedDays, d]);
    }
    setError('');
  };

  const setPreset = (days) => {
    setSelectedDays(days);
    setError('');
  };

  const getDaysSummaryText = () => {
    if (selectedDays.length === 1) {
      return `Scheduled on ${selectedDays[0]}`;
    }
    if (selectedDays.length === 7) {
      return 'Repeats every day (7 days)';
    }
    const isWeekdays = selectedDays.length === 5 && !selectedDays.includes('Saturday') && !selectedDays.includes('Sunday');
    if (isWeekdays) {
      return 'Repeats Weekdays: Mon to Fri (5 days)';
    }
    const shortNames = selectedDays.map((d) => d.substring(0, 3)).join(', ');
    return `Repeats on ${selectedDays.length} days: ${shortNames}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subjectName.trim()) {
      setError('Subject name is required.');
      return;
    }

    if (!selectedDays || selectedDays.length === 0) {
      setError('Please select at least one day for the schedule.');
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

    setSubmitting(true);
    const res = await onSave({
      subjectName: subjectName.trim(),
      days: selectedDays,
      day: selectedDays[0],
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
            className="w-full max-w-[390px] bg-[#1D1D1D] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-5 pb-7 sm:pb-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full aspect-square bg-[#24D366]/10 text-[#24D366] border border-[#24D366]/20 flex items-center justify-center shrink-0">
                  <CalendarPlus className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {editingClass ? 'Edit Schedule' : 'Add Subject Schedule'}
                  </h3>
                  <p className="text-[11px] text-[#9A9DA8]">
                    {editingClass ? `Edit ${selectedDays[0]} class` : 'Schedule single or repeating weekly days'}
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
                <label className="text-[11px] font-semibold text-[#9A9DA8] uppercase tracking-wider block mb-1.5 px-0.5">
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
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-3.5 py-3 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {subjectSuggestions.length > 0 && !editingClass && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 px-0.5">
                    <span className="text-[10px] text-[#9A9DA8] flex items-center gap-1">
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
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <label className="text-[11px] font-semibold text-[#9A9DA8] uppercase tracking-wider flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-[#24D366]" />
                    <span>Repeat on Days <span className="text-red-400">*</span></span>
                  </label>
                  <span className="text-[10.5px] font-bold text-[#24D366]">
                    {selectedDays.length} {selectedDays.length === 1 ? 'day' : 'days'}
                  </span>
                </div>

                {!editingClass && (
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1.5 mb-1.5">
                    <button
                      type="button"
                      onClick={() => setPreset([initialDay || 'Monday'])}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 1 && selectedDays[0] === initialDay
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      1 Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset(['Tuesday', 'Thursday'])}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 2 && selectedDays.includes('Tuesday') && selectedDays.includes('Thursday')
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      2 Days (Tue/Thu)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset(['Monday', 'Wednesday', 'Friday'])}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 3 && selectedDays.includes('Monday') && selectedDays.includes('Friday')
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      3 Days (MWF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset(['Monday', 'Tuesday', 'Wednesday', 'Thursday'])}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 4 && selectedDays.includes('Monday') && selectedDays.includes('Thursday')
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      4 Days (M-Th)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 5 && !selectedDays.includes('Saturday')
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      Weekdays (M-F)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset(DAYS_OF_WEEK)}
                      className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                        selectedDays.length === 7
                          ? 'bg-[#24D366]/15 border-[#24D366]/40 text-[#24D366]'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#9A9DA8] hover:text-white'
                      }`}
                    >
                      All 7 Days
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`py-2 px-0.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center leading-none ${
                          isSelected
                            ? 'bg-[#24D366] text-[#0B0C0F] shadow-sm font-extrabold scale-102'
                            : 'bg-white/[0.04] text-[#9A9DA8] hover:text-white border border-white/[0.04]'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10.5px] text-[#9A9DA8] mt-1.5 px-0.5">
                  {getDaysSummaryText()}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <label className="text-[11px] font-semibold text-[#9A9DA8] uppercase tracking-wider">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs font-bold text-[#24D366]">
                      {formatTime12h(startTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-2xl p-1.5 focus-within:border-white/30 transition-colors">
                    <div className="flex items-center gap-1.5 pl-1">
                      <select
                        aria-label="Start hour"
                        value={start12.hour}
                        onChange={(e) =>
                          handleStartChange(e.target.value, start12.minute, start12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-[#24D366] cursor-pointer"
                      >
                        {HOURS_LIST.map((h) => (
                          <option key={h} value={h} className="bg-[#1D1D1D] text-white">
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
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-[#24D366] cursor-pointer"
                      >
                        {startMinutesList.map((m) => (
                          <option key={m} value={m} className="bg-[#1D1D1D] text-white">
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
                            ? 'bg-[#24D366] text-[#0B0C0F] shadow-sm scale-105'
                            : 'text-[#9A9DA8] hover:text-white'
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
                            ? 'bg-[#24D366] text-[#0B0C0F] shadow-sm scale-105'
                            : 'text-[#9A9DA8] hover:text-white'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <label className="text-[11px] font-semibold text-[#9A9DA8] uppercase tracking-wider">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs font-bold text-[#24D366]">
                      {formatTime12h(endTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-2xl p-1.5 focus-within:border-white/30 transition-colors">
                    <div className="flex items-center gap-1.5 pl-1">
                      <select
                        aria-label="End hour"
                        value={end12.hour}
                        onChange={(e) =>
                          handleEndChange(e.target.value, end12.minute, end12.period)
                        }
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-[#24D366] cursor-pointer"
                      >
                        {HOURS_LIST.map((h) => (
                          <option key={h} value={h} className="bg-[#1D1D1D] text-white">
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
                        className="bg-[#1D1D1D] text-white font-bold text-sm rounded-xl px-2.5 py-2 border border-white/[0.08] focus:outline-none focus:border-[#24D366] cursor-pointer"
                      >
                        {endMinutesList.map((m) => (
                          <option key={m} value={m} className="bg-[#1D1D1D] text-white">
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
                            ? 'bg-[#24D366] text-[#0B0C0F] shadow-sm scale-105'
                            : 'text-[#9A9DA8] hover:text-white'
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
                            ? 'bg-[#24D366] text-[#0B0C0F] shadow-sm scale-105'
                            : 'text-[#9A9DA8] hover:text-white'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9A9DA8] uppercase tracking-wider block mb-1.5 px-0.5">
                  Room or Location <span className="text-[#9A9DA8] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 304, Lab 2, Main Hall"
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-3.5 py-3 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <MapPin className="w-4 h-4 text-[#9A9DA8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white/[0.05] hover:bg-white/10 text-[#9A9DA8] hover:text-white text-xs font-semibold py-3.5 rounded-2xl transition-all cursor-pointer border border-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#24D366] hover:bg-[#16A34A] text-[#0B0C0F] text-xs font-bold py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingClass
                    ? 'Save Changes'
                    : selectedDays.length > 1
                    ? `Add to ${selectedDays.length} Days`
                    : 'Save Schedule'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
