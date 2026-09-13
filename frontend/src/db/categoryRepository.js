import { getDB, generateId } from './database.js';

export const categoryRepository = {
  async getAll(type) {
    const db = await getDB();
    const categories = await db.getAll('categories');
    if (type) {
      return categories.filter((c) => c.type === type);
    }
    return categories;
  },

  async getById(id) {
    const db = await getDB();
    return db.get('categories', id);
  },

  async create(data) {
    const db = await getDB();
    const newCategory = {
      _id: generateId(),
      name: data.name.trim(),
      type: data.type || 'expense',
      icon: data.icon || 'tag',
      color: data.color || '#FF6B2C',
      createdAt: new Date().toISOString(),
    };
    await db.put('categories', newCategory);
    return newCategory;
  },

  async update(id, data) {
    const db = await getDB();
    const cat = await db.get('categories', id);
    if (!cat) throw new Error('Category not found');

    const updated = {
      ...cat,
      name: data.name !== undefined ? data.name.trim() : cat.name,
      type: data.type !== undefined ? data.type : cat.type,
      icon: data.icon !== undefined ? data.icon : cat.icon,
      color: data.color !== undefined ? data.color : cat.color,
    };

    await db.put('categories', updated);
    return updated;
  },

  async delete(id) {
    const db = await getDB();
    await db.delete('categories', id);
    return { success: true };
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    await tx.objectStore('categories').clear();
    await tx.done;
    return { success: true };
  },
};

