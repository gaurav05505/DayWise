import { subjectRepository } from '../db/subjectRepository.js';
import { settingsRepository } from '../db/settingsRepository.js';

export const calculateAttendanceStats = (attended, total, target = 75) => {
  const A = Math.max(0, Number(attended) || 0);
  const T = Math.max(0, Number(total) || 0);
  const P = Math.min(100, Math.max(1, Number(target) || 75));

  const exactPercentage = T > 0 ? (A / T) * 100 : 0;
  const percentage = Math.round(exactPercentage);

  const isTargetMet = T === 0 ? true : A * 100 >= P * T;
  const status = isTargetMet ? 'On Track' : 'Shortage';

  let needToAttend = 0;
  let canBunk = 0;

  if (T > 0) {
    if (isTargetMet) {
      needToAttend = 0;
      canBunk = Math.max(0, Math.floor((100 * A - P * T) / P));
    } else {
      canBunk = 0;
      needToAttend = Math.max(0, Math.ceil((P * T - 100 * A) / (100 - P)));
    }
  }

  return {
    attended: A,
    total: T,
    percentage,
    exactPercentage,
    target: P,
    isTargetMet,
    status,
    needToAttend,
    canBunk,
  };
};

export const attendanceService = {
  async getSubjects() {
    const subjects = await subjectRepository.getAll();
    const target = await settingsRepository.get('attendanceTarget', 75);

    return subjects.map((sub) => {
      const total = Number(sub.totalClasses) || 0;
      const attended = Number(sub.attendedClasses) || 0;
      const stats = calculateAttendanceStats(attended, total, target);

      return {
        ...sub,
        percentage: stats.percentage,
        attendancePercentage: stats.percentage,
        exactPercentage: stats.exactPercentage,
        target,
        targetAttendance: target,
        status: stats.status,
        isTargetMet: stats.isTargetMet,
        canBunk: stats.canBunk,
        needToAttend: stats.needToAttend,
      };
    });
  },

  async createSubject(data) {
    return subjectRepository.create(data);
  },

  async updateSubject(id, data) {
    return subjectRepository.update(id, data);
  },

  async markPresent(id, meta = {}) {
    return subjectRepository.markPresent(id, meta);
  },

  async markAbsent(id, meta = {}) {
    return subjectRepository.markAbsent(id, meta);
  },

  async markBulkAttendance(attendanceList) {
    return subjectRepository.markBulk(attendanceList);
  },

  async deleteSubject(id) {
    return subjectRepository.delete(id);
  },

  async deleteLog(subjectId, logId) {
    return subjectRepository.deleteLog(subjectId, logId);
  },

  async getSummary() {
    const subjects = await this.getSubjects();
    const target = await settingsRepository.get('attendanceTarget', 75);

    const totalClasses = subjects.reduce((sum, s) => sum + (Number(s.totalClasses) || 0), 0);
    const attendedClasses = subjects.reduce((sum, s) => sum + (Number(s.attendedClasses) || 0), 0);

    const stats = calculateAttendanceStats(attendedClasses, totalClasses, target);

    let recommendation = '';
    if (totalClasses === 0) {
      recommendation = 'No classes recorded yet';
    } else if (stats.isTargetMet) {
      if (stats.canBunk > 0) {
        recommendation = `You are On Track. You can miss ${stats.canBunk} class${stats.canBunk > 1 ? 'es' : ''} and maintain ${target}% attendance.`;
      } else {
        recommendation = `You are On Track at ${stats.percentage}%. Avoid missing any upcoming classes.`;
      }
    } else {
      recommendation = `Shortage alert: You must attend ${stats.needToAttend} consecutive class${stats.needToAttend > 1 ? 'es' : ''} to reach ${target}% attendance.`;
    }

    return {
      totalSubjects: subjects.length,
      totalClasses,
      totalAttendedClasses: attendedClasses,
      attendedClasses,
      missedClasses: totalClasses - attendedClasses,
      overallPercentage: stats.percentage,
      overallAttendancePercentage: stats.percentage,
      exactPercentage: stats.exactPercentage,
      target,
      targetAttendance: target,
      status: stats.status,
      isTargetMet: stats.isTargetMet,
      canBunk: stats.canBunk,
      needToAttend: stats.needToAttend,
      recommendation,
    };
  },
};
