import mongoose from 'mongoose';
import CustomBudget from '../models/customBudget.model.js';
import CustomBudgetTransaction from '../models/customBudgetTransaction.model.js';

const formatBudgetWithSpent = async (budgetDoc) => {
  const obj = budgetDoc.toObject ? budgetDoc.toObject() : budgetDoc;
  const transactions = await CustomBudgetTransaction.find({ customBudget: obj._id });
  const spent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const remaining = obj.amount - spent;
  const percentageUsed = obj.amount > 0 ? Math.round((spent / obj.amount) * 100) : 0;
  const isOverBudget = spent > obj.amount;

  return {
    ...obj,
    spent,
    remaining,
    percentageUsed,
    isOverBudget,
    totalTransactions: transactions.length,
  };
};

export const createCustomBudget = async (req, res) => {
  try {
    const { name, amount, description, startDate, endDate } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Budget name is required' });
    }

    if (amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Budget amount must be greater than 0' });
    }

    const budget = await CustomBudget.create({
      name: name.trim(),
      amount: Number(amount),
      description: description ? description.trim() : '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    const formatted = await formatBudgetWithSpent(budget);

    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCustomBudgets = async (req, res) => {
  try {
    const budgets = await CustomBudget.find().sort({ createdAt: -1 });
    const formatted = await Promise.all(budgets.map(formatBudgetWithSpent));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomBudgetById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid custom budget ID' });
    }

    const budget = await CustomBudget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Custom budget not found' });
    }

    const formatted = await formatBudgetWithSpent(budget);
    const transactions = await CustomBudgetTransaction.find({ customBudget: id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      ...formatted,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, description, startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid custom budget ID' });
    }

    const budget = await CustomBudget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Custom budget not found' });
    }

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Budget name cannot be empty' });
      }
      budget.name = name.trim();
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      budget.amount = Number(amount);
    }

    if (description !== undefined) {
      budget.description = description.trim();
    }

    if (startDate !== undefined) {
      budget.startDate = startDate ? new Date(startDate) : undefined;
    }

    if (endDate !== undefined) {
      budget.endDate = endDate ? new Date(endDate) : undefined;
    }

    await budget.save();
    const formatted = await formatBudgetWithSpent(budget);

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomBudget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid custom budget ID' });
    }

    const budget = await CustomBudget.findByIdAndDelete(id);
    if (!budget) {
      return res.status(404).json({ message: 'Custom budget not found' });
    }

    await CustomBudgetTransaction.deleteMany({ customBudget: id });

    res.status(200).json({ success: true, message: 'Custom budget and its transactions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomBudgetTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid custom budget ID' });
    }

    const budget = await CustomBudget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Custom budget not found' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Transaction title is required' });
    }

    if (amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await CustomBudgetTransaction.create({
      customBudget: id,
      title: title.trim(),
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomBudgetTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid custom budget ID' });
    }

    const transactions = await CustomBudgetTransaction.find({ customBudget: id }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomBudgetTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await CustomBudgetTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      transaction.title = title.trim();
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      transaction.amount = Number(amount);
    }

    if (date !== undefined) {
      transaction.date = new Date(date);
    }

    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomBudgetTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await CustomBudgetTransaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
