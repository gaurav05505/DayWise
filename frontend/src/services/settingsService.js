import { getDB } from '../db/database.js';
import { settingsRepository } from '../db/settingsRepository.js';
import { subjectRepository } from '../db/subjectRepository.js';
import { budgetRepository } from '../db/budgetRepository.js';
import { categoryRepository } from '../db/categoryRepository.js';
import { transactionRepository } from '../db/transactionRepository.js';
import { customBudgetRepository } from '../db/customBudgetRepository.js';

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
      const [
        subjects,
        categories,
        transactions,
        budgets,
        customBudgets,
        customBudgetTransactions,
        settings,
      ] = await Promise.all([
        db.getAll('subjects'),
        db.getAll('categories'),
        db.getAll('transactions'),
        db.getAll('budgets'),
        db.getAll('customBudgets'),
        db.getAll('customBudgetTransactions'),
        db.getAll('settings'),
      ]);

      const exportPayload = {
        app: 'DayWise',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        settings,
        subjects,
        categories,
        transactions,
        budgets,
        customBudgets,
        customBudgetTransactions,
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
      const stores = [
        'subjects',
        'categories',
        'transactions',
        'budgets',
        'customBudgets',
        'customBudgetTransactions',
        'settings',
      ];

      const tx = db.transaction(stores, 'readwrite');

      if (Array.isArray(jsonData.subjects)) {
        await tx.objectStore('subjects').clear();
        for (const item of jsonData.subjects) {
          await tx.objectStore('subjects').put(item);
        }
      }

      if (Array.isArray(jsonData.categories)) {
        await tx.objectStore('categories').clear();
        for (const item of jsonData.categories) {
          await tx.objectStore('categories').put(item);
        }
      }

      if (Array.isArray(jsonData.transactions)) {
        await tx.objectStore('transactions').clear();
        for (const item of jsonData.transactions) {
          await tx.objectStore('transactions').put(item);
        }
      }

      if (Array.isArray(jsonData.budgets)) {
        await tx.objectStore('budgets').clear();
        for (const item of jsonData.budgets) {
          await tx.objectStore('budgets').put(item);
        }
      }

      if (Array.isArray(jsonData.customBudgets)) {
        await tx.objectStore('customBudgets').clear();
        for (const item of jsonData.customBudgets) {
          await tx.objectStore('customBudgets').put(item);
        }
      }

      if (Array.isArray(jsonData.customBudgetTransactions)) {
        await tx.objectStore('customBudgetTransactions').clear();
        for (const item of jsonData.customBudgetTransactions) {
          await tx.objectStore('customBudgetTransactions').put(item);
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

  async resetBudgetData() {
    try {
      await budgetRepository.resetAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async resetAllData() {
    try {
      await Promise.all([
        subjectRepository.resetAll(),
        budgetRepository.resetAll(),
        categoryRepository.resetAll(),
        customBudgetRepository.resetAll(),
        settingsRepository.resetAll(),
      ]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
