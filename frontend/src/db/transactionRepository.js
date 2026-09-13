import { getDB, generateId } from './database.js';

export const transactionRepository = {
  async getAll(month, year, type, categoryId) {
    const db = await getDB();
    let txList = await db.getAll('transactions');

    if (month !== undefined && year !== undefined) {
      txList = txList.filter((tx) => {
        const d = new Date(tx.date);
        return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
      });
    }

    if (type) {
      txList = txList.filter((tx) => tx.type === type);
    }

    if (categoryId) {
      txList = txList.filter((tx) => {
        const catId = typeof tx.category === 'object' ? tx.category._id : tx.category;
        return catId === categoryId;
      });
    }

    txList.sort((a, b) => new Date(b.date) - new Date(a.date));

    const categories = await db.getAll('categories');
    const catMap = new Map(categories.map((c) => [c._id, c]));

    return txList.map((tx) => {
      const catId = typeof tx.category === 'object' ? tx.category._id : tx.category;
      return {
        ...tx,
        category: catMap.get(catId) || tx.category || { _id: catId, name: 'General', type: tx.type },
      };
    });
  },

  async getById(id) {
    const db = await getDB();
    const tx = await db.get('transactions', id);
    if (!tx) return null;

    const catId = typeof tx.category === 'object' ? tx.category._id : tx.category;
    if (catId) {
      const category = await db.get('categories', catId);
      return { ...tx, category: category || tx.category };
    }
    return tx;
  },

  async create(data) {
    const db = await getDB();
    const newTx = {
      _id: generateId(),
      title: data.title ? data.title.trim() : (data.type === 'income' ? 'Received Money' : 'Spend'),
      amount: Number(data.amount) || 0,
      type: data.type || 'expense',
      category: typeof data.category === 'object' ? data.category._id : data.category,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put('transactions', newTx);
    return this.getById(newTx._id);
  },

  async update(id, data) {
    const db = await getDB();
    const tx = await db.get('transactions', id);
    if (!tx) throw new Error('Transaction not found');

    const updated = {
      ...tx,
      title: data.title !== undefined ? data.title.trim() : tx.title,
      amount: data.amount !== undefined ? Number(data.amount) : tx.amount,
      type: data.type !== undefined ? data.type : tx.type,
      category: data.category !== undefined ? (typeof data.category === 'object' ? data.category._id : data.category) : tx.category,
      date: data.date !== undefined ? new Date(data.date).toISOString() : tx.date,
      updatedAt: new Date().toISOString(),
    };

    await db.put('transactions', updated);
    return this.getById(id);
  },

  async delete(id) {
    const db = await getDB();
    await db.delete('transactions', id);
    return { success: true };
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction('transactions', 'readwrite');
    await tx.objectStore('transactions').clear();
    await tx.done;
    return { success: true };
  },
};

