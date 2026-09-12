import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, PiggyBank, Home } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleAddFixedExpense = (e) => {
    e.preventDefault();
    setError('');

    if (!newTitle.trim()) {
      setError('Expense name is required (e.g. Rent, Rasan)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[360px] max-h-[85vh] flex flex-col bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h3 className="text-[16px] font-semibold text-[#EDEDED]">
              Monthly Expense & Savings
            </h3>
            <p className="text-[12px] text-[#9A9A9A]">
              Rent, Rasan & Target Savings
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
          <div className="bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-lg p-2.5 mb-3 shrink-0">
            {error}
          </div>
        )}

        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          <div className="bg-[#242424] border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <PiggyBank className="w-4 h-4 text-[#8CFF57]" />
              <label className="text-[12.5px] font-medium text-[#EDEDED]">
                Monthly Savings Goal (₹)
              </label>
            </div>
            <input
              type="number"
              min="0"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[14px] font-semibold text-[#8CFF57] focus:outline-none focus:border-[#8CFF57]"
            />
          </div>

          <div className="bg-[#242424] border border-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#FF6B2C]" />
                <span className="text-[12.5px] font-medium text-[#EDEDED]">
                  Fixed Monthly Expenses
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[#FF6B2C]">
                ₹{totalFixed.toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleAddFixedExpense} className="space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rent, Rasan"
                  className="bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
                />
                <input
                  type="number"
                  min="1"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="₹ Amount"
                  className="bg-[#1A1A1A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF6B2C] hover:bg-[#ff550f] text-white text-[12px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Fixed Item</span>
              </button>
            </form>

            <div className="space-y-1.5">
              {expensesList.length === 0 ? (
                <p className="text-[12px] text-[#666666] text-center py-2">
                  No fixed expenses added yet.
                </p>
              ) : (
                expensesList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#1C1C1C] border border-white/5 rounded-lg px-2.5 py-1.5 text-[12.5px]"
                  >
                    <span className="text-[#EDEDED]">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#9A9A9A] font-medium">
                        ₹{Number(item.amount).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFixedExpense(item.id)}
                        className="text-[#888888] hover:text-[#ff4d4f] p-0.5 cursor-pointer"
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

        <div className="flex gap-2 pt-3 border-t border-white/5 shrink-0 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#282828] hover:bg-[#323232] text-[#9A9A9A] text-[13px] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex-1 bg-[#277A10] hover:bg-[#20660c] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
};

