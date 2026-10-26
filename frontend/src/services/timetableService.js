import { timetableRepository } from '../db/timetableRepository.js';

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const formatTime12h = (time24) => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map((val) => parseInt(val, 10) || 0);
  return h * 60 + m;
};

export const getDurationText = (startTime, endTime) => {
  const startM = timeToMinutes(startTime);
  const endM = timeToMinutes(endTime);
  const diff = endM - startM;
  if (diff <= 0) return '';
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

export const getTodayDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
};

export const timetableService = {
  async getAllClasses() {
    return timetableRepository.getAll();
  },

  async getClassesForDay(day) {
    return timetableRepository.getByDay(day);
  },

  async addClass(data) {
    if (data.days && Array.isArray(data.days) && data.days.length > 0) {
      return this.addWeekSubject(data);
    }
    const existing = await timetableRepository.getByDay(data.day);
    const validation = this.validateClass(data, existing);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return timetableRepository.create(data);
  },

  async addWeekSubject(data) {
    const daysToSchedule = data.days && Array.isArray(data.days) && data.days.length > 0
      ? data.days
      : [data.day];

    if (!data.subjectName || !data.subjectName.trim()) {
      throw new Error('Subject name is required.');
    }
    if (!data.startTime) {
      throw new Error('Start time is required.');
    }
    if (!data.endTime) {
      throw new Error('End time is required.');
    }
    const startM = timeToMinutes(data.startTime);
    const endM = timeToMinutes(data.endTime);
    if (endM <= startM) {
      throw new Error('End time must be later than start time.');
    }

    const itemsToCreate = [];
    const conflicts = [];

    for (const d of daysToSchedule) {
      const existing = await timetableRepository.getByDay(d);
      const validation = this.validateClass({ ...data, day: d }, existing);
      if (!validation.isValid) {
        conflicts.push(`${d}: ${validation.error}`);
      } else {
        itemsToCreate.push({
          subjectName: data.subjectName.trim(),
          day: d,
          startTime: data.startTime,
          endTime: data.endTime,
          room: data.room ? data.room.trim() : '',
          color: data.color || '#24D366',
        });
      }
    }

    if (itemsToCreate.length === 0 && conflicts.length > 0) {
      throw new Error(conflicts[0]);
    }

    const created = await timetableRepository.createMany(itemsToCreate);
    return {
      success: true,
      createdCount: created.length,
      scheduledDays: itemsToCreate.map((i) => i.day),
      conflicts,
    };
  },

  async copyDaySchedule(sourceDay, targetDays = [], overwrite = false) {
    if (!DAYS_OF_WEEK.includes(sourceDay)) {
      throw new Error('Invalid source day.');
    }
    const sourceClasses = await timetableRepository.getByDay(sourceDay);
    if (sourceClasses.length === 0) {
      throw new Error(`No classes found on ${sourceDay} to copy.`);
    }

    const validTargets = targetDays.filter((d) => DAYS_OF_WEEK.includes(d) && d !== sourceDay);
    if (validTargets.length === 0) {
      throw new Error('Please select at least one different day to copy to.');
    }

    let totalCopied = 0;
    for (const targetDay of validTargets) {
      if (overwrite) {
        await timetableRepository.deleteByDay(targetDay);
      }
      const existing = overwrite ? [] : await timetableRepository.getByDay(targetDay);
      const toInsert = [];

      for (const item of sourceClasses) {
        const itemData = {
          subjectName: item.subjectName,
          day: targetDay,
          startTime: item.startTime,
          endTime: item.endTime,
          room: item.room || '',
          color: item.color || '#24D366',
        };
        const validation = this.validateClass(itemData, existing);
        if (validation.isValid) {
          toInsert.push(itemData);
        }
      }

      if (toInsert.length > 0) {
        await timetableRepository.createMany(toInsert);
        totalCopied += toInsert.length;
      }
    }

    return {
      success: true,
      copiedCount: totalCopied,
      targetDays: validTargets,
    };
  },

  getWeeklySummary(allClasses = []) {
    const byDay = {};
    for (const d of DAYS_OF_WEEK) {
      byDay[d] = [];
    }

    for (const item of allClasses) {
      if (byDay[item.day]) {
        byDay[item.day].push(item);
      }
    }

    for (const d of DAYS_OF_WEEK) {
      byDay[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    const subjectsMap = {};
    for (const item of allClasses) {
      const name = item.subjectName.trim();
      if (!subjectsMap[name]) {
        subjectsMap[name] = {
          name,
          classes: [],
          days: new Set(),
        };
      }
      subjectsMap[name].classes.push(item);
      subjectsMap[name].days.add(item.day);
    }

    const subjectsList = Object.values(subjectsMap).map((s) => ({
      name: s.name,
      classesCount: s.classes.length,
      daysCount: s.days.size,
      days: Array.from(s.days),
      sampleTime: s.classes[0]
        ? `${formatTime12h(s.classes[0].startTime)} - ${formatTime12h(s.classes[0].endTime)}`
        : '',
      room: s.classes[0]?.room || '',
    })).sort((a, b) => b.classesCount - a.classesCount);

    const activeDaysCount = Object.values(byDay).filter((arr) => arr.length > 0).length;

    return {
      totalClasses: allClasses.length,
      activeDaysCount,
      byDay,
      subjects: subjectsList,
    };
  },

  async updateClass(id, data) {
    const existing = await timetableRepository.getByDay(data.day);
    const validation = this.validateClass(data, existing, id);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return timetableRepository.update(id, data);
  },

  async deleteClass(id) {
    return timetableRepository.delete(id);
  },

  validateClass(data, dayClasses = [], excludeId = null) {
    if (!data.subjectName || !data.subjectName.trim()) {
      return { isValid: false, error: 'Subject name is required.' };
    }

    if (!data.day || !DAYS_OF_WEEK.includes(data.day)) {
      return { isValid: false, error: 'Please select a valid day.' };
    }

    if (!data.startTime) {
      return { isValid: false, error: 'Start time is required.' };
    }

    if (!data.endTime) {
      return { isValid: false, error: 'End time is required.' };
    }

    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);

    if (endMinutes <= startMinutes) {
      return { isValid: false, error: 'End time must be later than start time.' };
    }

    const otherClasses = dayClasses.filter((c) => c._id !== excludeId);

    const duplicate = otherClasses.find(
      (c) =>
        c.subjectName.toLowerCase() === data.subjectName.trim().toLowerCase() &&
        c.startTime === data.startTime
    );
    if (duplicate) {
      return {
        isValid: false,
        error: `A class for "${data.subjectName.trim()}" at ${formatTime12h(data.startTime)} is already scheduled on ${data.day}.`,
      };
    }

    const overlapping = otherClasses.find((c) => {
      const cStart = timeToMinutes(c.startTime);
      const cEnd = timeToMinutes(c.endTime);
      return Math.max(startMinutes, cStart) < Math.min(endMinutes, cEnd);
    });

    if (overlapping) {
      return {
        isValid: false,
        error: `Time overlaps with "${overlapping.subjectName}" (${formatTime12h(overlapping.startTime)} - ${formatTime12h(overlapping.endTime)}).`,
        overlappingClass: overlapping,
      };
    }

    return { isValid: true };
  },

  getCurrentAndNextClass(allClasses = []) {
    return this.getScheduleStatus(allClasses);
  },

  getScheduleStatus(allClasses = []) {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const todayName = dayNames[currentDayIndex];
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (!allClasses || allClasses.length === 0) {
      return {
        hasAnySchedule: false,
        todayName,
        todayClasses: [],
        currentClass: null,
        upcomingSoonClass: null,
        currentStatus: 'no_schedule',
        nextClass: null,
        nextClassTiming: null,
      };
    }

    const todayClasses = allClasses
      .filter((c) => c.day === todayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    let currentClass = null;
    let upcomingSoonClass = null;
    let nextClass = null;
    let nextClassTiming = null;

    for (const c of todayClasses) {
      const startM = timeToMinutes(c.startTime);
      const endM = timeToMinutes(c.endTime);

      if (nowMinutes >= startM && nowMinutes < endM) {
        currentClass = c;
      } else if (nowMinutes < startM) {
        if (!nextClass) {
          nextClass = c;
          const diff = startM - nowMinutes;
          if (diff <= 15) {
            upcomingSoonClass = c;
          }
          const hours = Math.floor(diff / 60);
          const mins = diff % 60;
          let diffStr = '';
          if (hours > 0 && mins > 0) {
            diffStr = `Starts in ${hours}h ${mins}m`;
          } else if (hours > 0) {
            diffStr = `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
          } else {
            diffStr = `Starts in ${mins} min`;
          }
          nextClassTiming = {
            dayLabel: 'Today',
            timeRemaining: diffStr,
            diffMinutes: diff,
          };
        }
      }
    }

    if (!nextClass) {
      for (let offset = 1; offset <= 6; offset++) {
        const nextDayIndex = (currentDayIndex + offset) % 7;
        const nextDayName = dayNames[nextDayIndex];
        const futureClasses = allClasses
          .filter((c) => c.day === nextDayName)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (futureClasses.length > 0) {
          nextClass = futureClasses[0];
          const dayLabel = offset === 1 ? 'Tomorrow' : nextDayName;
          nextClassTiming = {
            dayLabel,
            timeRemaining: `Starts ${dayLabel} at ${formatTime12h(nextClass.startTime)}`,
            diffMinutes: null,
          };
          break;
        }
      }
    }

    let statusLabel = 'No class right now';
    if (currentClass) {
      statusLabel = 'Ongoing';
    } else if (upcomingSoonClass) {
      const diff = timeToMinutes(upcomingSoonClass.startTime) - nowMinutes;
      statusLabel = `Starts in ${diff} min`;
    }

    return {
      hasAnySchedule: true,
      todayName,
      todayClasses,
      currentClass,
      upcomingSoonClass,
      statusLabel,
      nextClass,
      nextClassTiming,
    };
  },
};
