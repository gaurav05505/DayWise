import { getDB } from '../db/database.js';
import { settingsRepository } from '../db/settingsRepository.js';
import { subjectRepository } from '../db/subjectRepository.js';
import { timetableRepository } from '../db/timetableRepository.js';

export const settingsService = {
  async getSettings() {
    return settingsRepository.getAll();
  },

  async saveSettings(newSettings) {
    return settingsRepository.setMultiple(newSettings);
  },

  async exportAllData() {
    try {
      const db = await getDB();
      const [subjects, settings, timetable] = await Promise.all([
        db.getAll('subjects'),
        db.getAll('settings'),
        db.getAll('timetable'),
      ]);

      const exportPayload = {
        app: 'DayWise',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        settings,
        subjects,
        timetable,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `daywise-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async importData(jsonData) {
    try {
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid JSON format');
      }

      const db = await getDB();
      const stores = ['subjects', 'settings', 'timetable'];

      const tx = db.transaction(stores, 'readwrite');

      if (Array.isArray(jsonData.subjects)) {
        await tx.objectStore('subjects').clear();
        for (const item of jsonData.subjects) {
          await tx.objectStore('subjects').put(item);
        }
      }

      if (Array.isArray(jsonData.timetable)) {
        await tx.objectStore('timetable').clear();
        for (const item of jsonData.timetable) {
          await tx.objectStore('timetable').put(item);
        }
      }

      if (Array.isArray(jsonData.settings)) {
        await tx.objectStore('settings').clear();
        for (const item of jsonData.settings) {
          await tx.objectStore('settings').put(item);
        }
      } else if (jsonData.settings && typeof jsonData.settings === 'object') {
        for (const [key, value] of Object.entries(jsonData.settings)) {
          await tx.objectStore('settings').put({ key, value });
        }
      }

      await tx.done;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async resetAttendanceData() {
    try {
      await subjectRepository.resetAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async resetAllData() {
    try {
      await Promise.all([
        subjectRepository.resetAll(),
        timetableRepository.resetAll(),
        settingsRepository.resetAll(),
      ]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
