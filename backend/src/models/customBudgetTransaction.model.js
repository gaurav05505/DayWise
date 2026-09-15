import mongoose from 'mongoose';

const customBudgetTransactionSchema = new mongoose.Schema(
  {
    customBudget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomBudget',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CustomBudgetTransaction = mongoose.model(
  'CustomBudgetTransaction',
  customBudgetTransactionSchema
);

export default CustomBudgetTransaction;

