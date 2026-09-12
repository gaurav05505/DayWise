import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';

export const QuickMinusModal = ({
  isOpen,
  onClose,
  initialType = 'expense',
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(initialType);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const presets = [10, 20, 50, 100, 200, 500];

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount('');
      setNote('');
      setError('');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handlePreset = (val) => {
    setAmount((prev) => {
      const current = Number(prev) || 0;
      return String(current + val);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    const res = await onAddTransaction({
      amount: numAmount,
      type,
      title: note.trim() || (type === 'income' ? 'Received Money' : 'Spend'),
    });
    setSubmitting(false);

    if (res?.success) {
      onClose();
    } else {
      setError(res?.error || 'Failed to process transaction');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[340px] bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[#EDEDED]">
            {type === 'expense' ? 'Minus Money' : 'Add Money'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex rounded-xl bg-[#242424] p-1 mb-4">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 text-[12.5px] font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              type === 'expense'
                ? 'bg-[#FF6B2C] text-white shadow-sm'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Minus Money</span>
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 text-[12.5px] font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              type === 'income'
                ? 'bg-[#277A10] text-white shadow-sm'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Money</span>
          </button>
        </div>

        {error && (
          <div className="bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-lg p-2.5 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#242424] border border-white/10 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-[12px] text-[#9A9A9A] mb-1">Enter Amount</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-[22px] font-semibold text-[#9A9A9A]">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className="w-36 bg-transparent text-[28px] font-bold text-center text-[#EDEDED] focus:outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-[#888888] mb-1.5 font-medium">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className="bg-[#262626] hover:bg-[#333333] active:scale-95 text-[#EDEDED] text-[12.5px] font-medium py-1.5 rounded-xl border border-white/5 transition-all cursor-pointer"
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional e.g. Snacks, Chai, Auto)"
              className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#282828] hover:bg-[#323232] text-[#9A9A9A] text-[13px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !amount || Number(amount) <= 0}
              className={`flex-1 text-white text-[13.5px] font-semibold py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-98 ${
                type === 'income'
                  ? 'bg-[#277A10] hover:bg-[#20660c]'
                  : 'bg-[#FF6B2C] hover:bg-[#ff550f]'
              }`}
            >
              {submitting
                ? 'Processing...'
                : type === 'income'
                ? `Add ₹${amount || 0}`
                : `Minus ₹${amount || 0}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
