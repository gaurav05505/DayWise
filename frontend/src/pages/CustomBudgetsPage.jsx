import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, PiggyBank, Sparkles } from 'lucide-react';
import { useCustomBudgets } from '../hooks/useCustomBudgets.js';
import { CustomBudgetSummary } from '../components/customBudget/CustomBudgetSummary.jsx';
import { CustomBudgetCard } from '../components/customBudget/CustomBudgetCard.jsx';
import { CreateBudgetModal } from '../components/customBudget/CreateBudgetModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';

export const CustomBudgetsPage = ({ onNavigate, onSelectBudget }) => {
  const {
    budgets,
    summary,
    loading,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useCustomBudgets();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleSaveBudget = async (data) => {
    if (editingBudget) {
      await updateBudget(editingBudget._id, data);
      setEditingBudget(null);
    } else {
      await createBudget(data);
    }
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = async (budget) => {
    if (window.confirm(`Are you sure you want to delete "${budget.name}"?`)) {
      await deleteBudget(budget._id);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28">
        <PageTransition className="flex-1 flex flex-col">
          <header className="pt-4 pb-2 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6D1F] to-[#E85C0D] p-[2px] shadow-lg shadow-[#FF6D1F]/10">
                  <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-[#FF6D1F]" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF6D1F] rounded-full border-2 border-[#090A0F]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#FF6D1F] uppercase tracking-wider block">
                  DayWise
                </span>
                <h1 className="text-[17px] font-bold text-white tracking-tight">
                  Custom Budgets
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingBudget(null);
                setIsCreateModalOpen(true);
              }}
              className="bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-md shadow-[#FF6D1F]/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create</span>
            </button>
          </header>

          <main className="flex-1 space-y-4">
            <CustomBudgetSummary summary={summary} />

            <div className="flex items-center justify-between pt-1 px-1">
              <h2 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
                Your Budgets ({budgets.length})
              </h2>
            </div>

            {loading && budgets.length === 0 ? (
              <SkeletonCard count={2} />
            ) : budgets.length === 0 ? (
              <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-8 text-center shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <PiggyBank className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  No Custom Budgets
                </h3>
                <p className="text-xs text-[#8A92A0] max-w-[240px] mx-auto mb-4 leading-relaxed">
                  Create independent budgets for Travel, Food, Gym, College, Shopping, etc.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBudget(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#FF6D1F]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create First Budget</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {budgets.map((budget) => (
                    <CustomBudgetCard
                      key={budget._id}
                      budget={budget}
                      onSelect={() => onSelectBudget?.(budget._id)}
                      onEdit={() => handleEditClick(budget)}
                      onDelete={() => handleDeleteClick(budget)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </PageTransition>

        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingBudget(null);
          }}
          onSave={handleSaveBudget}
          initialData={editingBudget}
        />
      </div>
    </div>
  );
};
