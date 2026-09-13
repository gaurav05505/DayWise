import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, PiggyBank, Home } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

export const MonthlyPlanningModal = ({
  isOpen,
  onClose,
  fixedExpenses = [],
  targetSavings = 0,
  onSavePlanning,
}) => {
  const [savings, setSavings] = useState(targetSavings || 0);
  const [expensesList, setExpensesList] = useState(fixedExpenses || []);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSavings(targetSavings || 0);
      setExpensesList(fixedExpenses || []);
      setNewTitle('');
      setNewAmount('');
      setError('');
    }
  }, [isOpen, fixedExpenses, targetSavings]);

  const handleAddFixedExpense = (e) => {
    e.preventDefault();
    setError('');

    if (!newTitle.trim()) {
      setError('Expense name is required (e.g. Rent, Mess)');
      return;
    }

    const amt = Number(newAmount);
    if (!newAmount || amt <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setExpensesList((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTitle.trim(), amount: amt },
    ]);

    setNewTitle('');
    setNewAmount('');
  };

  const handleRemoveFixedExpense = (id) => {
    setExpensesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveAll = () => {
    onSavePlanning({
      targetSavings: Number(savings) || 0,
      fixedExpenses: expensesList,
    });
    onClose();
  };

  const totalFixed = expensesList.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

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
                  <PiggyBank className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Planning & Goals
                  </h3>
                  <p className="text-[11px] text-[#8A92A0]">
                    Rent, Fixed Expenses & Savings
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

            <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 my-2">
              <div className="bg-[#1A1F29] border border-white/[0.06] rounded-2xl p-3.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <PiggyBank className="w-4 h-4 text-[#FF6D1F]" />
                  <label className="text-xs font-bold text-white">
                    Monthly Savings Goal (₹)
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full bg-[#14171E] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-[#FF6D1F] focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>

              <div className="bg-[#1A1F29] border border-white/[0.06] rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-xs font-bold text-white">
                      Fixed Monthly Expenses
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#F59E0B]">
                    ₹{totalFixed.toLocaleString()}
                  </span>
                </div>

                <form onSubmit={handleAddFixedExpense} className="space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Rent, Mess"
                      className="bg-[#14171E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F]"
                    />
                    <input
                      type="number"
                      min="1"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="₹ Amount"
                      className="bg-[#14171E] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Fixed Expense</span>
                  </button>
                </form>

                <div className="space-y-1.5">
                  {expensesList.length === 0 ? (
                    <p className="text-xs text-[#525B6D] text-center py-2">
                      No fixed expenses added yet.
                    </p>
                  ) : (
                    expensesList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-[#14171E] border border-white/[0.06] rounded-xl px-3 py-2 text-xs"
                      >
                        <span className="text-white font-medium">{item.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#8A92A0] font-semibold">
                            ₹{Number(item.amount).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFixedExpense(item.id)}
                            className="text-[#8A92A0] hover:text-[#EF4444] p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-white/[0.06] shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#1A1F29] hover:bg-[#222834] text-[#8A92A0] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex-1 bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#FF6D1F]/20 cursor-pointer"
              >
                Save Plan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
