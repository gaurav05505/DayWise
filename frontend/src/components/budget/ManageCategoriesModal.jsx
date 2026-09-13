import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';

export const ManageCategoriesModal = ({
  isOpen,
  onClose,
  categories = [],
  onAddCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setSubmitting(true);
    const res = await onAddCategory({ name: name.trim(), type });
    setSubmitting(false);

    if (res?.success) {
      setName('');
    } else {
      setError(res?.error || 'Failed to add category');
    }
  };

  const currentCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-[360px] max-h-[85vh] flex flex-col bg-[#14171E] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center">
              <Tag className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Manage Categories
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
          <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-xl p-2.5 my-2 shrink-0">
            {error}
          </div>
        )}

        <div className="flex rounded-2xl bg-[#1A1F29] p-1.5 my-3 shrink-0 border border-white/[0.06]">
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

        <form onSubmit={handleAdd} className="mb-3 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`New ${type} category...`}
              required
              className="flex-1 min-w-0 bg-[#1A1F29] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#525B6D] focus:outline-none focus:border-[#FF6D1F]"
            />

            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-2 bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 shrink-0 transition-all shadow-md shadow-[#FF6D1F]/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 border-t border-white/[0.06] pt-2">
          <h4 className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider mb-2">
            {type} Categories ({currentCategories.length})
          </h4>

          {currentCategories.length === 0 ? (
            <p className="text-xs text-[#525B6D] py-3 text-center">
              No {type} categories added yet.
            </p>
          ) : (
            currentCategories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between bg-[#1A1F29] border border-white/[0.06] rounded-2xl px-3.5 py-2.5 text-xs"
              >
                <span className="text-white font-medium truncate max-w-[200px]">{c.name}</span>
                <button
                  type="button"
                  onClick={() => onDeleteCategory(c._id)}
                  className="text-[#8A92A0] hover:text-[#EF4444] p-1 transition-colors cursor-pointer shrink-0"
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
