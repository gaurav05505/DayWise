import { customBudgetRepository } from '../db/customBudgetRepository.js';

export const customBudgetService = {
  async getCustomBudgets() {
    return customBudgetRepository.getAll();
  },

  async getCustomBudgetById(id) {
    return customBudgetRepository.getById(id);
  },

  async createCustomBudget(data) {
    return customBudgetRepository.create(data);
  },

  async updateCustomBudget(id, data) {
    return customBudgetRepository.update(id, data);
  },

  async deleteCustomBudget(id) {
    return customBudgetRepository.delete(id);
  },

  async getTransactions(budgetId) {
    return customBudgetRepository.getTransactions(budgetId);
  },

  async getCustomBudgetTransactions(budgetId) {
    return customBudgetRepository.getTransactions(budgetId);
  },

  async createTransaction(budgetId, data) {
    return customBudgetRepository.createTransaction(budgetId, data);
  },

  async addCustomBudgetTransaction(data) {
    const { customBudgetId, ...rest } = data;
    return customBudgetRepository.createTransaction(customBudgetId, rest);
  },

  async updateTransaction(transactionId, data) {
    return customBudgetRepository.updateTransaction(transactionId, data);
  },

  async deleteTransaction(transactionId) {
    return customBudgetRepository.deleteTransaction(transactionId);
  },

  async deleteCustomBudgetTransaction(transactionId) {
    return customBudgetRepository.deleteTransaction(transactionId);
  },
};
