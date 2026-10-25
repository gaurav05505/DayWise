import { calculateAttendanceStats } from './attendanceService.js';

export const PERIODS = [
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: 'semester', label: 'Semester', days: 120 },
  { id: 'all', label: 'All Time', days: null },
];

export const filterLogsByPeriod = (logs, periodId) => {
  if (!Array.isArray(logs) || logs.length === 0) return [];
  if (periodId === 'all') return [...logs];

  const periodObj = PERIODS.find((p) => p.id === periodId);
  const days = periodObj?.days || 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  return logs.filter((log) => {
    const logDate = log.timestamp ? new Date(log.timestamp) : log.dateKey ? new Date(log.dateKey) : null;
    return logDate && logDate >= cutoff;
  });
};

export const buildAttendanceTimeSeries = (subjects, periodId = '30d', target = 75, subjectId = null) => {
  const filteredSubjects = subjectId
    ? subjects.filter((s) => s._id === subjectId)
    : subjects;

  if (!filteredSubjects || filteredSubjects.length === 0) {
    return {
      points: [],
      periodHeld: 0,
      periodAttended: 0,
      periodMissed: 0,
      periodPercentage: 0,
      hasEnoughHistory: false,
    };
  }

  let allLogs = [];
  let baseHeld = 0;
  let baseAttended = 0;

  filteredSubjects.forEach((sub) => {
    const logs = Array.isArray(sub.logs) ? sub.logs : [];
    const totalClasses = Number(sub.totalClasses) || 0;
    const attendedClasses = Number(sub.attendedClasses) || 0;

    const presentLogsCount = logs.filter((l) => l.status === 'present').length;
    const subBaseHeld = Math.max(0, totalClasses - logs.length);
    const subBaseAttended = Math.max(0, attendedClasses - presentLogsCount);

    baseHeld += subBaseHeld;
    baseAttended += subBaseAttended;

    logs.forEach((log) => {
      allLogs.push({
        ...log,
        subjectId: sub._id,
        subjectName: sub.name,
        parsedDate: log.timestamp ? new Date(log.timestamp) : log.dateKey ? new Date(log.dateKey) : new Date(),
      });
    });
  });

  allLogs.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  const periodObj = PERIODS.find((p) => p.id === periodId);
  const cutoff = periodObj?.days
    ? new Date(Date.now() - periodObj.days * 86400000)
    : null;

  let runningHeld = baseHeld;
  let runningAttended = baseAttended;

  const dayBuckets = new Map();

  allLogs.forEach((log) => {
    runningHeld += 1;
    if (log.status === 'present') {
      runningAttended += 1;
    }

    const dateKey = log.dateKey || log.parsedDate.toISOString().split('T')[0];
    const isWithinPeriod = !cutoff || log.parsedDate >= cutoff;

    if (!dayBuckets.has(dateKey)) {
      dayBuckets.set(dateKey, {
        dateKey,
        dateObj: log.parsedDate,
        dateLabel: log.date || log.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isWithinPeriod,
        logsCount: 0,
        attendedDelta: 0,
        missedDelta: 0,
        cumulativeHeld: runningHeld,
        cumulativeAttended: runningAttended,
        cumulativePercentage: runningHeld > 0 ? Math.round((runningAttended / runningHeld) * 100) : 0,
      });
    }

    const bucket = dayBuckets.get(dateKey);
    bucket.logsCount += 1;
    if (log.status === 'present') {
      bucket.attendedDelta += 1;
    } else {
      bucket.missedDelta += 1;
    }
    bucket.cumulativeHeld = runningHeld;
    bucket.cumulativeAttended = runningAttended;
    bucket.cumulativePercentage = runningHeld > 0 ? Math.round((runningAttended / runningHeld) * 100) : 0;
  });

  const periodPoints = Array.from(dayBuckets.values()).filter((b) => b.isWithinPeriod);

  let periodHeld = 0;
  let periodAttended = 0;
  let periodMissed = 0;

  periodPoints.forEach((p) => {
    periodHeld += p.logsCount;
    periodAttended += p.attendedDelta;
    periodMissed += p.missedDelta;
  });

  const periodPercentage = periodHeld > 0 ? Math.round((periodAttended / periodHeld) * 100) : 0;

  const finalPoints = periodPoints.map((p) => ({
    date: p.dateLabel,
    dateKey: p.dateKey,
    percentage: p.cumulativePercentage,
    attended: p.cumulativeAttended,
    total: p.cumulativeHeld,
    dayAttended: p.attendedDelta,
    dayHeld: p.logsCount,
    isTargetMet: p.cumulativePercentage >= target,
  }));

  const totalHeldCurrent = filteredSubjects.reduce((sum, s) => sum + (Number(s.totalClasses) || 0), 0);
  const totalAttendedCurrent = filteredSubjects.reduce((sum, s) => sum + (Number(s.attendedClasses) || 0), 0);
  const currentPercentage = totalHeldCurrent > 0 ? Math.round((totalAttendedCurrent / totalHeldCurrent) * 100) : 0;

  if (finalPoints.length === 0 && totalHeldCurrent > 0) {
    finalPoints.push({
      date: 'Current',
      dateKey: new Date().toISOString().split('T')[0],
      percentage: currentPercentage,
      attended: totalAttendedCurrent,
      total: totalHeldCurrent,
      dayAttended: 0,
      dayHeld: 0,
      isTargetMet: currentPercentage >= target,
    });
  }

  return {
    points: finalPoints,
    periodHeld,
    periodAttended,
    periodMissed,
    periodPercentage,
    hasEnoughHistory: finalPoints.length > 1,
    currentPercentage,
    totalHeldCurrent,
    totalAttendedCurrent,
  };
};

export const getSubjectComparison = (subjects, target = 75) => {
  if (!Array.isArray(subjects)) return [];

  const list = subjects.map((sub) => {
    const total = Number(sub.totalClasses) || 0;
    const attended = Number(sub.attendedClasses) || 0;
    const stats = calculateAttendanceStats(attended, total, target);

    return {
      _id: sub._id,
      name: sub.name,
      total,
      attended,
      missed: Math.max(0, total - attended),
      percentage: stats.percentage,
      exactPercentage: stats.exactPercentage,
      isTargetMet: stats.isTargetMet,
      status: stats.status,
      needToAttend: stats.needToAttend,
      canBunk: stats.canBunk,
      color: sub.color || '#24D366',
    };
  });

  return list.sort((a, b) => a.percentage - b.percentage);
};
