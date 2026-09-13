import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Zap } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const AddCustomShortcutModal = ({
  isOpen,
  onClose,
  shortcuts = [],
  onAddShortcut,
  onDeleteShortcut,
}) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!label.trim()) {
      setError('Button label is required');
      return;
    }

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    onAddShortcut({
      id: Date.now().toString(),
      label: label.trim(),
      amount: numAmount,
    });

    setLabel('');
    setAmount('');
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
            className="w-full max-w-[360px] max-h-[85vh] flex flex-col bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Quick Deduct Buttons
                  </h3>
                  <p className="text-[11px] text-[#8A92A0]">
                    Create 1-tap deduct shortcuts
                  </p>
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

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 my-2 shrink-0">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 my-3 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Rent, Chai"
                  required
                  className="bg-[#1A1F29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F]"
                />

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ Amount"
                  required
                  className="bg-[#1A1F29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#FF6D1F]/20 cursor-pointer"
              >
                + Add Custom Button
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 border-t border-white/[0.06] pt-3">
              <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider block mb-1">
                Your Buttons ({shortcuts.length})
              </span>

              {shortcuts.length === 0 ? (
                <p className="text-xs text-[#525B6D] text-center py-3">
                  No custom buttons added yet.
                </p>
              ) : (
                shortcuts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#1A1F29] border border-white/[0.06] rounded-2xl px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{item.label}</span>
                      <span className="text-[#EF4444] font-bold">
                        -₹{item.amount}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteShortcut(item.id)}
                      className="text-[#8A92A0] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
