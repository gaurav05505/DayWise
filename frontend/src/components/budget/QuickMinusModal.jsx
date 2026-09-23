import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

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
                  {type === 'expense' ? 'Minus Money' : 'Add Money'}
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
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'expense'
                    ? 'bg-[#EF4444] text-white shadow-md'
                    : 'text-[#8A92A0] hover:text-white'
                }`}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Minus Money</span>
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === 'income'
                    ? 'bg-[#10B981] text-white shadow-md'
                    : 'text-[#8A92A0] hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Money</span>
              </button>
            </div>

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="bg-[#1A1F29] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center">
                <span className="text-xs font-semibold text-[#8A92A0] mb-1">Enter Amount</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-[#8A92A0]">₹</span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    required
                    className="w-36 bg-transparent text-3xl font-black text-center text-white focus:outline-none placeholder-[#525B6D]"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-[#8A92A0] mb-1.5 font-bold uppercase tracking-wider">
                  Quick Presets
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePreset(val)}
                      className="bg-[#1A1F29] hover:bg-[#222834] active:scale-95 text-white text-xs font-semibold py-2 rounded-xl border border-white/[0.06] transition-all cursor-pointer"
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
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#55F130]"
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !amount || Number(amount) <= 0}
                  className={`flex-1 text-xs font-black py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-98 ${
                    type === 'income'
                      ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                      : 'bg-[#EF4444] hover:bg-[#DC2626] text-white'
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
