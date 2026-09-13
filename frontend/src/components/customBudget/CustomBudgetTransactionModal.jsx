import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownRight } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const CustomBudgetTransactionModal = ({
  isOpen,
  onClose,
  onAddTransaction,
  budgetName = 'Custom Budget',
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter an expense title / item name');
      return;
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: numAmount,
      date: date || new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-[360px] bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center">
                  <ArrowDownRight className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Add Expense</h2>
                  <p className="text-[11px] text-[#8A92A0]">To: {budgetName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {error && (
                <div className="p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Item / Expense Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Taxi ride, Lunch, Gym membership"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A92A0] text-sm font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="250"
                    min="1"
                    step="any"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold shadow-md shadow-[#FF6D1F]/20 transition-all cursor-pointer"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
