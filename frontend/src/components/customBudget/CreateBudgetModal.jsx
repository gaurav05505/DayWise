import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, PiggyBank } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';

const SUGGESTED_NAMES = [
  'Food & Dining',
  'Travel & Trip',
  'College / Tuition',
  'Gym & Fitness',
  'Books & Learning',
  'Shopping',
  'Laptop / Gadgets',
  'Emergency Fund',
];

export const CreateBudgetModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [name, setName] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setTotalBudget(initialData.totalBudget ? String(initialData.totalBudget) : '');
      setDescription(initialData.description || '');
      setStartDate(
        initialData.startDate
          ? new Date(initialData.startDate).toISOString().split('T')[0]
          : ''
      );
      setEndDate(
        initialData.endDate
          ? new Date(initialData.endDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setName('');
      setTotalBudget('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a budget name');
      return;
    }
    const numBudget = Number(totalBudget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setError('Please enter a valid target budget amount');
      return;
    }

    onSave({
      name: name.trim(),
      totalBudget: numBudget,
      description: description.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
    });
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
                <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center">
                  <PiggyBank className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-base font-bold text-white">
                  {initialData ? 'Edit Custom Budget' : 'New Custom Budget'}
                </h2>
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
                  Budget Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Travel, Gym, College, Shopping"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] text-[#8A92A0] mb-2">
                  <Sparkles className="w-3 h-3 text-[#FF6D1F]" />
                  <span>Suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_NAMES.map((sName) => (
                    <button
                      type="button"
                      key={sName}
                      onClick={() => setName(sName)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        name === sName
                          ? 'bg-[#FF6D1F]/20 border-[#FF6D1F] text-[#FF6D1F] font-bold'
                          : 'bg-[#1A1F29] border-white/[0.06] text-[#8A92A0] hover:text-white hover:border-white/20'
                      }`}
                    >
                      {sName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Target Budget Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A92A0] text-sm font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="5000"
                    min="1"
                    step="any"
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A92A0] mb-1.5">
                  Description / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. For Goa trip or Semester fees"
                  className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-[#525B6D] text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#8A92A0] mb-1">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#8A92A0] mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#1A1F29] border border-white/10 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#FF6D1F] transition-colors"
                  />
                </div>
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
                  {initialData ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
