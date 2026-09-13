import { budgetRepository } from '../db/budgetRepository.js';
import { transactionRepository } from '../db/transactionRepository.js';
import { categoryRepository } from '../db/categoryRepository.js';

export const budgetService = {
  async getCategories(type) {
    return categoryRepository.getAll(type);
  },

  async createCategory(data) {
    return categoryRepository.create(data);
  },

  async deleteCategory(id) {
    return categoryRepository.delete(id);
  },

  async getTransactions(month, year, type, category) {
    return transactionRepository.getAll(month, year, type, category);
  },

  async createTransaction(data) {
    return transactionRepository.create(data);
  },

  async updateTransaction(id, data) {
    return transactionRepository.update(id, data);
  },

  async deleteTransaction(id) {
    return transactionRepository.delete(id);
  },

  async setBudget(data) {
    return budgetRepository.setBudget(data);
  },

  async getBudget(month, year) {
    return budgetRepository.getBudget(month, year);
  },

  async getBudgetSummary(month, year) {
    return budgetRepository.getSummary(month, year);
  },

  async getCategorySummary(month, year) {
    return budgetRepository.getCategorySummary(month, year);
  },
};
