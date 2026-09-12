import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-[340px] max-h-[85vh] flex flex-col bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-[16px] font-semibold text-[#EDEDED]">
            Manage Categories
          </h3>
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

        <div className="flex rounded-xl bg-[#242424] p-1 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
              type === 'expense'
                ? 'bg-[#FF6B2C] text-white shadow-sm'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
              type === 'income'
                ? 'bg-[#277A10] text-white shadow-sm'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleAdd} className="mb-4 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`New ${type} category...`}
              required
              className="flex-1 min-w-0 bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-[#EDEDED] placeholder-[#666666] focus:outline-none focus:border-[#FF6B2C]"
            />

            <button
              type="submit"
              disabled={submitting}
              className={`px-3 py-2 text-white text-[12.5px] font-medium rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 shrink-0 transition-colors shadow-sm ${
                type === 'income'
                  ? 'bg-[#277A10] hover:bg-[#20660c]'
                  : 'bg-[#FF6B2C] hover:bg-[#ff550f]'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <h4 className="text-[12px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">
            {type} Categories ({currentCategories.length})
          </h4>

          {currentCategories.length === 0 ? (
            <p className="text-[12.5px] text-[#666666] py-3 text-center">
              No {type} categories added yet.
            </p>
          ) : (
            currentCategories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between bg-[#222222] border border-white/5 rounded-xl px-3 py-2 text-[13px]"
              >
                <span className="text-[#EDEDED] truncate max-w-[200px]">{c.name}</span>
                <button
                  type="button"
                  onClick={() => onDeleteCategory(c._id)}
                  className="text-[#888888] hover:text-[#ff4d4f] p-1 transition-colors cursor-pointer shrink-0"
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
