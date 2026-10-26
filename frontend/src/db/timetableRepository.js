import { getDB, generateId } from './database.js';

export const timetableRepository = {
  async getAll() {
    const db = await getDB();
    const list = await db.getAll('timetable');
    return list.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async getByDay(day) {
    const db = await getDB();
    const index = db.transaction('timetable').store.index('by-day');
    const list = await index.getAll(day);
    return list.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async getById(id) {
    const db = await getDB();
    return db.get('timetable', id);
  },

  async create(data) {
    const db = await getDB();
    const item = {
      _id: generateId(),
      subjectName: data.subjectName.trim(),
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room ? data.room.trim() : '',
      color: data.color || '#24D366',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.put('timetable', item);
    return item;
  },

  async createMany(itemsList) {
    const db = await getDB();
    const tx = db.transaction('timetable', 'readwrite');
    const created = [];
    for (const data of itemsList) {
      const item = {
        _id: generateId(),
        subjectName: data.subjectName.trim(),
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room ? data.room.trim() : '',
        color: data.color || '#24D366',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await tx.store.put(item);
      created.push(item);
    }
    await tx.done;
    return created;
  },

  async update(id, data) {
    const db = await getDB();
    const item = await db.get('timetable', id);
    if (!item) throw new Error('Class schedule not found');

    const updated = {
      ...item,
      subjectName: data.subjectName !== undefined ? data.subjectName.trim() : item.subjectName,
      day: data.day !== undefined ? data.day : item.day,
      startTime: data.startTime !== undefined ? data.startTime : item.startTime,
      endTime: data.endTime !== undefined ? data.endTime : item.endTime,
      room: data.room !== undefined ? data.room.trim() : item.room,
      color: data.color !== undefined ? data.color : item.color,
      updatedAt: new Date().toISOString(),
    };
    await db.put('timetable', updated);
    return updated;
  },

  async delete(id) {
    const db = await getDB();
    await db.delete('timetable', id);
    return { success: true };
  },

  async deleteByDay(day) {
    const db = await getDB();
    const index = db.transaction('timetable', 'readwrite').store.index('by-day');
    const keys = await index.getAllKeys(day);
    const tx = db.transaction('timetable', 'readwrite');
    for (const key of keys) {
      await tx.store.delete(key);
    }
    await tx.done;
    return { success: true, count: keys.length };
  },

  async resetAll() {
    const db = await getDB();
    await db.clear('timetable');
    return { success: true };
  },
};
