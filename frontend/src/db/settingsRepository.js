import { getDB } from './database.js';

export const settingsRepository = {
  async get(key, defaultValue = null) {
    const db = await getDB();
    const item = await db.get('settings', key);
    return item ? item.value : defaultValue;
  },

  async set(key, value) {
    const db = await getDB();
    await db.put('settings', { key, value });
    return value;
  },

  async getAll() {
    const db = await getDB();
    const items = await db.getAll('settings');
    const result = {
      theme: 'dark',
      attendanceTarget: 75,
      progressCardColor: '#FF6D1F',
      showRecommendations: true,
    };
    items.forEach((item) => {
      result[item.key] = item.value;
    });
    return result;
  },

  async setMultiple(settingsObj) {
    const db = await getDB();
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');

    for (const [key, value] of Object.entries(settingsObj)) {
      await store.put({ key, value });
    }
    await tx.done;
    return this.getAll();
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    await store.clear();
    await store.put({ key: 'theme', value: 'dark' });
    await store.put({ key: 'attendanceTarget', value: 75 });
    await store.put({ key: 'progressCardColor', value: '#FF6D1F' });
    await store.put({ key: 'showRecommendations', value: true });
    await tx.done;
    return {
      theme: 'dark',
      attendanceTarget: 75,
      progressCardColor: '#FF6D1F',
      showRecommendations: true,
    };
  },
};

