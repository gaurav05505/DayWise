import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  categories = [],
  onUpdateTransaction,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && transaction) {
      setTitle(transaction.title || '');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setType(transaction.type || 'expense');
      setCategory(
        transaction.category?._id || transaction.category || ''
      );
      setDate(
        transaction.date
          ? new Date(transaction.date).toISOString().split('T')[0]
          : ''
      );
      setError('');
    }
  }, [isOpen, transaction]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    setSubmitting(true);
    const res = await onUpdateTransaction(transaction._id, {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    });
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to update transaction');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && transaction && (
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
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center">
                  <Pencil className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Edit Transaction
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 my-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                >
                  {filteredCategories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#FF6D1F] hover:bg-[#E85C0D] disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#FF6D1F]/20 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
