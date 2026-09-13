import { getDB, generateId } from './database.js';

export const subjectRepository = {
  async getAll() {
    const db = await getDB();
    const subjects = await db.getAll('subjects');
    return subjects.map((sub) => {
      const totalClasses = Number(sub.totalClasses) || 0;
      const attendedClasses = Number(sub.attendedClasses) || 0;
      const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
      return {
        ...sub,
        percentage,
      };
    });
  },

  async getById(id) {
    const db = await getDB();
    const sub = await db.get('subjects', id);
    if (!sub) return null;
    const totalClasses = Number(sub.totalClasses) || 0;
    const attendedClasses = Number(sub.attendedClasses) || 0;
    const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
    return {
      ...sub,
      percentage,
    };
  },

  async create(data) {
    const db = await getDB();
    const newSubject = {
      _id: generateId(),
      name: data.name.trim(),
      totalClasses: Number(data.totalClasses) || 0,
      attendedClasses: Number(data.attendedClasses) || 0,
      color: data.color || '#FF6B2C',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.put('subjects', newSubject);
    return this.getById(newSubject._id);
  },

  async update(id, data) {
    const db = await getDB();
    const sub = await db.get('subjects', id);
    if (!sub) throw new Error('Subject not found');

    const updated = {
      ...sub,
      name: data.name !== undefined ? data.name.trim() : sub.name,
      totalClasses: data.totalClasses !== undefined ? Number(data.totalClasses) : sub.totalClasses,
      attendedClasses: data.attendedClasses !== undefined ? Number(data.attendedClasses) : sub.attendedClasses,
      color: data.color !== undefined ? data.color : sub.color,
      updatedAt: new Date().toISOString(),
    };

    await db.put('subjects', updated);
    return this.getById(id);
  },

  async markPresent(id) {
    const db = await getDB();
    const sub = await db.get('subjects', id);
    if (!sub) throw new Error('Subject not found');

    const updated = {
      ...sub,
      totalClasses: (Number(sub.totalClasses) || 0) + 1,
      attendedClasses: (Number(sub.attendedClasses) || 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    await db.put('subjects', updated);
    return this.getById(id);
  },

  async markAbsent(id) {
    const db = await getDB();
    const sub = await db.get('subjects', id);
    if (!sub) throw new Error('Subject not found');

    const updated = {
      ...sub,
      totalClasses: (Number(sub.totalClasses) || 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    await db.put('subjects', updated);
    return this.getById(id);
  },

  async markBulk(attendanceList) {
    const db = await getDB();
    const tx = db.transaction('subjects', 'readwrite');
    const store = tx.objectStore('subjects');

    for (const item of attendanceList) {
      const sub = await store.get(item.subjectId);
      if (sub) {
        let total = Number(sub.totalClasses) || 0;
        let attended = Number(sub.attendedClasses) || 0;

        if (item.status === 'present') {
          total += 1;
          attended += 1;
        } else if (item.status === 'absent') {
          total += 1;
        }

        await store.put({
          ...sub,
          totalClasses: total,
          attendedClasses: attended,
          updatedAt: new Date().toISOString(),
        });
      }
    }
    await tx.done;
    return this.getAll();
  },

  async delete(id) {
    const db = await getDB();
    await db.delete('subjects', id);
    return { success: true };
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction('subjects', 'readwrite');
    await tx.objectStore('subjects').clear();
    await tx.done;
    return { success: true };
  },
};

