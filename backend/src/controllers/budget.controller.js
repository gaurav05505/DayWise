import Budget from '../models/budget.model.js';
import Transaction from '../models/transaction.model.js';

export const setBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;

    if (amount === undefined || Number(amount) < 0) {
      return res
        .status(400)
        .json({ message: 'Amount must be a non-negative number' });
    }

    if (
      month === undefined ||
      Number(month) < 1 ||
      Number(month) > 12 ||
      !Number.isInteger(Number(month))
    ) {
      return res
        .status(400)
        .json({ message: 'Month must be an integer between 1 and 12' });
    }

    if (year === undefined || !Number.isInteger(Number(year))) {
      return res.status(400).json({ message: 'Year must be a valid integer' });
    }

    const budget = await Budget.findOneAndUpdate(
      { month: Number(month), year: Number(year) },
      { amount: Number(amount) },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: 'Budget set successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: 'Month and year query parameters are required' });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (parsedMonth < 1 || parsedMonth > 12) {
      return res
        .status(400)
        .json({ message: 'Month must be between 1 and 12' });
    }

    const budget = await Budget.findOne({
      month: parsedMonth,
      year: parsedYear,
    });

    if (!budget) {
      return res.status(200).json({
        amount: 0,
        month: parsedMonth,
        year: parsedYear,
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: 'Month and year query parameters are required' });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (parsedMonth < 1 || parsedMonth > 12) {
      return res
        .status(400)
        .json({ message: 'Month must be between 1 and 12' });
    }

    const startDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
    const endDate = new Date(Date.UTC(parsedYear, parsedMonth, 1));

    const budgetDoc = await Budget.findOne({
      month: parsedMonth,
      year: parsedYear,
    });
    const monthlyBudget = budgetDoc ? budgetDoc.amount : 0;

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate },
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const tx of transactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else if (tx.type === 'expense') {
        totalExpenses += tx.amount;
      }
    }

    const remainingBudget = monthlyBudget - totalExpenses;
    const totalTransactions = transactions.length;

    res.status(200).json({
      monthlyBudget,
      totalIncome,
      totalExpenses,
      remainingBudget,
      totalTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: 'Month and year query parameters are required' });
    }

    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (parsedMonth < 1 || parsedMonth > 12) {
      return res
        .status(400)
        .json({ message: 'Month must be between 1 and 12' });
    }

    const startDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
    const endDate = new Date(Date.UTC(parsedYear, parsedMonth, 1));

    const categorySummary = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $group: {
          _id: '$categoryDetails.name',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.status(200).json(categorySummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

