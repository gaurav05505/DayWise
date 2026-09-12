import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!label.trim()) {
      setError('Button label/name is required');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[340px] max-h-[85vh] flex flex-col bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h3 className="text-[16px] font-semibold text-[#EDEDED]">
              Quick Minus Buttons
            </h3>
            <p className="text-[12px] text-[#9A9A9A]">
              Create 1-tap custom deduct buttons
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

        <form onSubmit={handleSubmit} className="space-y-3 mb-4 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Rent, Chai"
              required
              className="bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
            />

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹ Amount"
              required
              className="bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF6B2C] hover:bg-[#ff550f] text-white text-[13px] font-medium py-2 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            + Add Custom Button
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 border-t border-white/5 pt-3">
          <span className="text-[11.5px] font-medium text-[#9A9A9A] uppercase tracking-wider block mb-1">
            Your Custom Buttons ({shortcuts.length})
          </span>

          {shortcuts.length === 0 ? (
            <p className="text-[12.5px] text-[#666666] text-center py-3">
              No custom buttons added yet.
            </p>
          ) : (
            shortcuts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#222222] border border-white/5 rounded-xl px-3 py-2 text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#EDEDED] font-medium">{item.label}</span>
                  <span className="text-[#FF6B2C] font-semibold text-[12px]">
                    -₹{item.amount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteShortcut(item.id)}
                  className="text-[#888888] hover:text-[#ff4d4f] p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

