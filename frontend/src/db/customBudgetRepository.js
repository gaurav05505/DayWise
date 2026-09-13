import { getDB, generateId } from './database.js';

export const customBudgetRepository = {
  async formatBudget(budget, allTransactions) {
    const bId = budget._id;
    const txs = allTransactions.filter((t) => t.customBudget === bId);
    const spent = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const amount = Number(budget.amount) || 0;
    const remaining = amount - spent;
    const percentageUsed = amount > 0 ? Math.round((spent / amount) * 100) : 0;
    const isOverBudget = spent > amount;

    return {
      ...budget,
      amount,
      totalBudget: amount,
      spent,
      totalSpent: spent,
      remaining,
      percentageUsed,
      percentage: percentageUsed,
      isOverBudget,
      totalTransactions: txs.length,
    };
  },

  async getAll() {
    const db = await getDB();
    const budgets = await db.getAll('customBudgets');
    const allTx = await db.getAll('customBudgetTransactions');
    budgets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return Promise.all(budgets.map((b) => this.formatBudget(b, allTx)));
  },

  async getById(id) {
    const db = await getDB();
    const budget = await db.get('customBudgets', id);
    if (!budget) return null;

    const allTx = await db.getAll('customBudgetTransactions');
    const formatted = await this.formatBudget(budget, allTx);
    const transactions = allTx
      .filter((t) => t.customBudget === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      ...formatted,
      transactions,
    };
  },

  async create(data) {
    const db = await getDB();
    const amt = Number(data.amount !== undefined ? data.amount : data.totalBudget) || 0;
    const newBudget = {
      _id: generateId(),
      name: data.name ? data.name.trim() : '',
      amount: amt,
      description: data.description ? data.description.trim() : '',
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put('customBudgets', newBudget);
    return this.getById(newBudget._id);
  },

  async update(id, data) {
    const db = await getDB();
    const budget = await db.get('customBudgets', id);
    if (!budget) throw new Error('Custom budget not found');

    const amt = data.amount !== undefined ? Number(data.amount) : (data.totalBudget !== undefined ? Number(data.totalBudget) : budget.amount);

    const updated = {
      ...budget,
      name: data.name !== undefined ? data.name.trim() : budget.name,
      amount: amt,
      description: data.description !== undefined ? data.description.trim() : budget.description,
      startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate).toISOString() : null) : budget.startDate,
      endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate).toISOString() : null) : budget.endDate,
      updatedAt: new Date().toISOString(),
    };

    await db.put('customBudgets', updated);
    return this.getById(id);
  },

  async delete(id) {
    const db = await getDB();
    const tx = db.transaction(['customBudgets', 'customBudgetTransactions'], 'readwrite');
    await tx.objectStore('customBudgets').delete(id);

    const cbtStore = tx.objectStore('customBudgetTransactions');
    const allCbt = await cbtStore.getAll();
    for (const item of allCbt) {
      if (item.customBudget === id) {
        await cbtStore.delete(item._id);
      }
    }
    await tx.done;
    return { success: true };
  },

  async getTransactions(customBudgetId) {
    const db = await getDB();
    const allTx = await db.getAll('customBudgetTransactions');
    return allTx
      .filter((t) => t.customBudget === customBudgetId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async createTransaction(customBudgetId, data) {
    const db = await getDB();
    const newTx = {
      _id: generateId(),
      customBudget: customBudgetId,
      title: data.title ? data.title.trim() : 'Expense',
      amount: Number(data.amount) || 0,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put('customBudgetTransactions', newTx);
    return newTx;
  },

  async updateTransaction(transactionId, data) {
    const db = await getDB();
    const tx = await db.get('customBudgetTransactions', transactionId);
    if (!tx) throw new Error('Transaction not found');

    const updated = {
      ...tx,
      title: data.title !== undefined ? data.title.trim() : tx.title,
      amount: data.amount !== undefined ? Number(data.amount) : tx.amount,
      date: data.date !== undefined ? new Date(data.date).toISOString() : tx.date,
      updatedAt: new Date().toISOString(),
    };

    await db.put('customBudgetTransactions', updated);
    return updated;
  },

  async deleteTransaction(transactionId) {
    const db = await getDB();
    await db.delete('customBudgetTransactions', transactionId);
    return { success: true };
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction(['customBudgets', 'customBudgetTransactions'], 'readwrite');
    await tx.objectStore('customBudgets').clear();
    await tx.objectStore('customBudgetTransactions').clear();
    await tx.done;
    return { success: true };
  },
};

