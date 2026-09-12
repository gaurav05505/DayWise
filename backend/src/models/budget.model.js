import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;

