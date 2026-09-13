import { openDB } from 'idb';

const DB_NAME = 'daywise_db';
const DB_VERSION = 1;

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income', icon: 'wallet', color: '#8CFF57' },
  { name: 'Pocket Money', type: 'income', icon: 'piggy-bank', color: '#00C9A7' },
  { name: 'Food & Mess', type: 'expense', icon: 'utensils', color: '#FF9F43' },
  { name: 'Travel & Transport', type: 'expense', icon: 'bus', color: '#54A0FF' },
  { name: 'Rent & Accommodation', type: 'expense', icon: 'home', color: '#5F27CD' },
  { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#EE5253' },
  { name: 'Books & Supplies', type: 'expense', icon: 'book-open', color: '#8CFF57' },
  { name: 'Entertainment', type: 'expense', icon: 'film', color: '#FF6EA7' },
  { name: 'General Expense', type: 'expense', icon: 'tag', color: '#FF6B2C' },
];

export const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('subjects')) {
        const subjectStore = db.createObjectStore('subjects', { keyPath: '_id' });
        subjectStore.createIndex('by-name', 'name');
      }

      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: '_id' });
        categoryStore.createIndex('by-type', 'type');

        DEFAULT_CATEGORIES.forEach((cat) => {
          categoryStore.add({
            _id: generateId(),
            ...cat,
            createdAt: new Date().toISOString(),
          });
        });
      }

      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: '_id' });
        txStore.createIndex('by-category', 'category');
        txStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: '_id' });
      }

      if (!db.objectStoreNames.contains('customBudgets')) {
        db.createObjectStore('customBudgets', { keyPath: '_id' });
      }

      if (!db.objectStoreNames.contains('customBudgetTransactions')) {
        const cbtStore = db.createObjectStore('customBudgetTransactions', { keyPath: '_id' });
        cbtStore.createIndex('by-customBudget', 'customBudget');
        cbtStore.createIndex('by-date', 'date');
      }

      if (!db.objectStoreNames.contains('settings')) {
        const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
        settingsStore.add({ key: 'theme', value: 'dark' });
        settingsStore.add({ key: 'attendanceTarget', value: 75 });
      }
    },
  });
};

