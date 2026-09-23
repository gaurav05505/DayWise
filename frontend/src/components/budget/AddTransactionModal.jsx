import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const AddTransactionModal = ({
  isOpen,
  onClose,
  initialType = 'expense',
  categories = [],
  onAddTransaction,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    }
  }, [isOpen, initialType]);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0]._id);
    } else {
      setCategory('');
    }
  }, [type, categories]);

  if (!isOpen) return null;

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
      setError('Please select or create a category first');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    setSubmitting(true);
    const res = await onAddTransaction({
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
      setError(res?.error || 'Failed to add transaction');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-[360px] bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                type === 'expense' ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#10B981]/15 text-[#10B981]'
              }`}
            >
              {type === 'expense' ? (
                <ArrowDownRight className="w-4.5 h-4.5" />
              ) : (
                <ArrowUpRight className="w-4.5 h-4.5" />
              )}
            </div>
            <h3 className="text-base font-bold text-white">
              Add {type === 'income' ? 'Income' : 'Expense'}
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

        <div className="flex rounded-2xl bg-[#1A1F29] p-1.5 my-3.5 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-[#EF4444] text-white shadow-md'
                : 'text-[#8A92A0] hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[#10B981] text-[#090A0F] shadow-md'
                : 'text-[#8A92A0] hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        {error && (
          <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lunch, Freelance"
              required
              className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#525B6D] focus:outline-none focus:border-[#55F130] transition-colors"
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
              placeholder="0.00"
              required
              className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#55F130] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#55F130] transition-colors"
            >
              {filteredCategories.length === 0 ? (
                <option value="">No {type} categories found</option>
              ) : (
                filteredCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))
              )}
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
              className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#55F130] transition-colors"
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
              disabled={submitting || !category}
              className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                type === 'income'
                  ? 'bg-[#10B981] hover:bg-[#059669] text-[#090A0F]'
                  : 'bg-[#55F130] hover:bg-[#48D827] text-[#090A0F] shadow-[#55F130]/20'
              }`}
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
