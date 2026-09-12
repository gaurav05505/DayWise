import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService.js';

export const useBudget = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [txData, sumData, catSumData, catsData] = await Promise.all([
        budgetService.getTransactions(month, year),
        budgetService.getBudgetSummary(month, year),
        budgetService.getCategorySummary(month, year),
        budgetService.getCategories(),
      ]);
      setTransactions(txData);
      setSummary(sumData);
      setCategorySummary(catSumData);
      setCategories(catsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (data) => {
    try {
      const payload = { ...data };
      const targetType = payload.type || 'expense';

      if (!payload.date) {
        payload.date = new Date().toISOString().split('T')[0];
      }

      if (!payload.title || payload.title.trim() === '') {
        payload.title = targetType === 'income' ? 'Received Money' : 'Spend';
      }

      if (!payload.category) {
        let matched = categories.find((c) => c.type === targetType);
        if (!matched) {
          const newCat = await budgetService.createCategory({
            name: 'General',
            type: targetType,
          });
          matched = newCat.category || newCat;
        }
        payload.category = matched._id;
      }

      await budgetService.createTransaction(payload);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      await budgetService.updateTransaction(id, data);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await budgetService.deleteTransaction(id);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const setMonthlyBudget = async (amount) => {
    try {
      await budgetService.setBudget({ amount: Number(amount), month, year });
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addCategory = async (data) => {
    try {
      await budgetService.createCategory(data);
      const cats = await budgetService.getCategories();
      setCategories(cats);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await budgetService.deleteCategory(id);
      const cats = await budgetService.getCategories();
      setCategories(cats);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    month,
    year,
    setMonth,
    setYear,
    transactions,
    summary,
    categorySummary,
    categories,
    loading,
    error,
    refreshData: fetchData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setMonthlyBudget,
    addCategory,
    deleteCategory,
  };
};
