import { subjectRepository } from '../db/subjectRepository.js';
import { settingsRepository } from '../db/settingsRepository.js';

export const attendanceService = {
  async getSubjects() {
    const subjects = await subjectRepository.getAll();
    const target = await settingsRepository.get('attendanceTarget', 75);

    return subjects.map((sub) => {
      const total = Number(sub.totalClasses) || 0;
      const attended = Number(sub.attendedClasses) || 0;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

      let canBunk = 0;
      let needToAttend = 0;

      if (total > 0) {
        const targetRatio = target / 100;
        if (percentage >= target) {
          canBunk = Math.floor((attended - targetRatio * total) / targetRatio);
        } else {
          needToAttend = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
        }
      }

      return {
        ...sub,
        percentage,
        attendancePercentage: percentage,
        target,
        targetAttendance: target,
        canBunk: Math.max(0, canBunk),
        needToAttend: Math.max(0, needToAttend),
      };
    });
  },

  async createSubject(data) {
    return subjectRepository.create(data);
  },

  async updateSubject(id, data) {
    return subjectRepository.update(id, data);
  },

  async markPresent(id) {
    return subjectRepository.markPresent(id);
  },

  async markAbsent(id) {
    return subjectRepository.markAbsent(id);
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
    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    let recommendation = '';
    let canBunk = 0;
    let needToAttend = 0;

    if (totalClasses === 0) {
      recommendation = 'No classes recorded yet';
    } else if (overallPercentage >= target) {
      const targetRatio = target / 100;
      canBunk = Math.floor((attendedClasses - targetRatio * totalClasses) / targetRatio);
      if (canBunk > 0) {
        recommendation = `You can miss the next ${canBunk} class${canBunk > 1 ? 'es' : ''} and maintain ${target}% attendance.`;
      } else {
        recommendation = `You are at target attendance (${target}%). Avoid missing any upcoming classes.`;
      }
    } else {
      const targetRatio = target / 100;
      needToAttend = Math.ceil((targetRatio * totalClasses - attendedClasses) / (1 - targetRatio));
      needToAttend = Math.max(1, needToAttend);
      recommendation = `You must attend the next ${needToAttend} consecutive class${needToAttend > 1 ? 'es' : ''} to reach ${target}% attendance.`;
    }

    return {
      totalSubjects: subjects.length,
      totalClasses,
      totalAttendedClasses: attendedClasses,
      attendedClasses,
      missedClasses: totalClasses - attendedClasses,
      overallPercentage,
      overallAttendancePercentage: overallPercentage,
      target,
      targetAttendance: target,
      canBunk: Math.max(0, canBunk),
      needToAttend: Math.max(0, needToAttend),
      recommendation,
    };
  },
};
