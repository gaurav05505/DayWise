import { openDB } from 'idb';

const DB_NAME = 'daywise_db';
const DB_VERSION = 2;

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (!db.objectStoreNames.contains('subjects')) {
        const subjectStore = db.createObjectStore('subjects', { keyPath: '_id' });
        subjectStore.createIndex('by-name', 'name');
      }

      if (!db.objectStoreNames.contains('settings')) {
        const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
        settingsStore.add({ key: 'theme', value: 'dark' });
        settingsStore.add({ key: 'attendanceTarget', value: 75 });
      }

      if (!db.objectStoreNames.contains('timetable')) {
        const timetableStore = db.createObjectStore('timetable', { keyPath: '_id' });
        timetableStore.createIndex('by-day', 'day');
        timetableStore.createIndex('by-subject', 'subjectName');
      }
    },
  });
};
