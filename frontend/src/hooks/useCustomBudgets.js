import { useState, useEffect, useCallback } from 'react';
import { customBudgetService } from '../services/customBudgetService.js';

export const useCustomBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customBudgetService.getCustomBudgets();
      setBudgets(Array.isArray(data) ? data : (data?.customBudgets || []));
    } catch (err) {
      setError(err.message);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const totalCustomBudgets = Array.isArray(budgets)
    ? budgets.reduce((sum, b) => sum + (b.amount || b.totalBudget || 0), 0)
    : 0;
  const totalSpent = Array.isArray(budgets)
    ? budgets.reduce((sum, b) => sum + (b.spent || b.totalSpent || 0), 0)
    : 0;
  const totalRemaining = totalCustomBudgets - totalSpent;

  const createBudget = async (data) => {
    try {
      await customBudgetService.createCustomBudget(data);
      await fetchBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBudget = async (id, data) => {
    try {
      await customBudgetService.updateCustomBudget(id, data);
      await fetchBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBudget = async (id) => {
    try {
      await customBudgetService.deleteCustomBudget(id);
      await fetchBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addExpenseToBudget = async (budgetId, data) => {
    try {
      await customBudgetService.createTransaction(budgetId, data);
      await fetchBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteExpenseFromBudget = async (transactionId) => {
    try {
      await customBudgetService.deleteTransaction(transactionId);
      await fetchBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    budgets: Array.isArray(budgets) ? budgets : [],
    summary: {
      totalCustomBudgets,
      totalSpent,
      totalRemaining,
      count: Array.isArray(budgets) ? budgets.length : 0,
    },
    loading,
    error,
    refreshBudgets: fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    addExpenseToBudget,
    deleteExpenseFromBudget,
  };
};
