import mongoose from 'mongoose';
import Transaction from '../models/transaction.model.js';
import Category from '../models/category.model.js';

export const createTransaction = async (req, res) => {
  try {
    let { title, amount, type = 'expense', category, date } = req.body;

    if (amount === undefined || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ message: 'Amount must be greater than 0' });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      type = 'expense';
    }

    if (!title || title.trim() === '') {
      title = type === 'income' ? 'Received Money' : 'Spend';
    }

    if (!date) {
      date = new Date();
    }

    let categoryId = category;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      let defaultCat = await Category.findOne({
        name: 'General',
        type,
      });

      if (!defaultCat) {
        defaultCat = await Category.create({
          name: 'General',
          type,
        });
      }

      categoryId = defaultCat._id;
    } else {
      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (categoryDoc.type !== type) {
        return res.status(400).json({
          message: `Category type '${categoryDoc.type}' does not match transaction type '${type}'`,
        });
      }
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: Number(amount),
      type,
      category: categoryId,
      date: new Date(date),
    });

    const populatedTransaction = await Transaction.findById(transaction._id).populate(
      'category'
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: populatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { type, category, month, year } = req.query;
    const filter = {};

    if (type) {
      if (!['income', 'expense'].includes(type)) {
        return res
          .status(400)
          .json({ message: 'Type must be either income or expense' });
      }
      filter.type = type;
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      filter.category = category;
    }

    if (year && month) {
      const parsedYear = Number(year);
      const parsedMonth = Number(month);
      const startDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
      const endDate = new Date(Date.UTC(parsedYear, parsedMonth, 1));
      filter.date = { $gte: startDate, $lt: endDate };
    } else if (year) {
      const parsedYear = Number(year);
      const startDate = new Date(Date.UTC(parsedYear, 0, 1));
      const endDate = new Date(Date.UTC(parsedYear + 1, 0, 1));
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(filter)
      .populate('category')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(id).populate('category');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const targetType = type || transaction.type;
    const targetCategory = category || transaction.category;

    if (type && !['income', 'expense'].includes(type)) {
      return res
        .status(400)
        .json({ message: 'Type must be either income or expense' });
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    if (type || category) {
      const categoryDoc = await Category.findById(targetCategory);
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (categoryDoc.type !== targetType) {
        return res.status(400).json({
          message: `Category type '${categoryDoc.type}' does not match transaction type '${targetType}'`,
        });
      }
    }

    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      transaction.title = title.trim();
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res
          .status(400)
          .json({ message: 'Amount must be greater than 0' });
      }
      transaction.amount = Number(amount);
    }

    if (type !== undefined) {
      transaction.type = type;
    }

    if (category !== undefined) {
      transaction.category = category;
    }

    if (date !== undefined) {
      transaction.date = new Date(date);
    }

    await transaction.save();

    const updatedTransaction = await Transaction.findById(id).populate('category');

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
