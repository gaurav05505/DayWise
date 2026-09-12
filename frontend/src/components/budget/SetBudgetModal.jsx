import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const SetBudgetModal = ({
  isOpen,
  onClose,
  currentBudget = 0,
  month,
  year,
  onSetBudget,
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(currentBudget > 0 ? String(currentBudget) : '');
      setError('');
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (amount === '' || Number(amount) < 0) {
      setError('Amount must be a non-negative number');
      return;
    }

    setSubmitting(true);
    const res = await onSetBudget(Number(amount));
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to update budget');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[340px] bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#EDEDED]">
              Set Monthly Budget
            </h3>
            <p className="text-[12px] text-[#9A9A9A]">
              For Month {month}/{year}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-lg p-2.5 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-medium text-[#9A9A9A] mb-1">
              Monthly Budget Limit (₹)
            </label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              required
              className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13.5px] text-[#EDEDED] focus:outline-none focus:border-[#FF6B2C] transition-colors"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#282828] hover:bg-[#323232] text-[#9A9A9A] text-[13px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#FF6B2C] hover:bg-[#ff550f] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

