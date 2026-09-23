import { getDB, generateId } from './database.js';
import { transactionRepository } from './transactionRepository.js';

export const budgetRepository = {
  async getBudget(month, year) {
    const db = await getDB();
    const budgets = await db.getAll('budgets');
    const matched = budgets.find(
      (b) => Number(b.month) === Number(month) && Number(b.year) === Number(year)
    );
    return matched || { amount: 0, month: Number(month), year: Number(year) };
  },

  async setBudget({ amount, month, year }) {
    const db = await getDB();
    const budgets = await db.getAll('budgets');
    let matched = budgets.find(
      (b) => Number(b.month) === Number(month) && Number(b.year) === Number(year)
    );

    if (matched) {
      matched.amount = Number(amount) || 0;
      matched.updatedAt = new Date().toISOString();
      await db.put('budgets', matched);
      return matched;
    }

    const newBudget = {
      _id: generateId(),
      amount: Number(amount) || 0,
      month: Number(month),
      year: Number(year),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.put('budgets', newBudget);
    return newBudget;
  },

  async getSummary(month, year) {
    const budget = await this.getBudget(month, year);
    const transactions = await transactionRepository.getAll(month, year);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const monthlyBudget = Number(budget.amount) || 0;
    const balance = totalIncome - totalExpense;
    const remainingBudget = monthlyBudget - totalExpense;
    const percentageUsed = monthlyBudget > 0 ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
    const isOverBudget = totalExpense > monthlyBudget;

    return {
      monthlyBudget,
      totalIncome,
      totalExpense,
      totalExpenses: totalExpense,
      balance,
      remainingBudget,
      percentageUsed,
      isOverBudget,
      month: Number(month),
      year: Number(year),
    };
  },

  async getCategorySummary(month, year) {
    const transactions = await transactionRepository.getAll(month, year, 'expense');
    const db = await getDB();
    const categories = await db.getAll('categories');
    const catMap = new Map(categories.map((c) => [c._id, c]));

    const groupMap = new Map();
    let totalExpense = 0;

    for (const tx of transactions) {
      const catId = typeof tx.category === 'object' ? tx.category._id : tx.category;
      const cat = catMap.get(catId) || { _id: catId, name: 'General', color: '#55F130' };
      const amt = Number(tx.amount) || 0;
      totalExpense += amt;

      if (!groupMap.has(catId)) {
        groupMap.set(catId, {
          _id: catId,
          name: cat.name,
          color: cat.color,
          totalAmount: 0,
          count: 0,
        });
      }
      const existing = groupMap.get(catId);
      existing.totalAmount += amt;
      existing.count += 1;
    }

    return Array.from(groupMap.values()).map((g) => ({
      ...g,
      percentage: totalExpense > 0 ? Math.round((g.totalAmount / totalExpense) * 100) : 0,
    }));
  },

  async resetAll() {
    const db = await getDB();
    const tx = db.transaction(['budgets', 'transactions'], 'readwrite');
    await tx.objectStore('budgets').clear();
    await tx.objectStore('transactions').clear();
    await tx.done;
    return { success: true };
  },
};

