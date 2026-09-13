import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  TrendingDown,
  Receipt,
  Loader2,
} from 'lucide-react';
import { BudgetProgress } from '../components/customBudget/BudgetProgress.jsx';
import { CustomBudgetTransactionModal } from '../components/customBudget/CustomBudgetTransactionModal.jsx';
import { CreateBudgetModal } from '../components/customBudget/CreateBudgetModal.jsx';
import { BottomNavigation } from '../components/attendance/BottomNavigation.jsx';
import { customBudgetService } from '../services/customBudgetService.js';
import { formatCurrency, formatDate, getBudgetIcon } from '../utils/budgetUtils.js';
import { PageTransition } from '../components/animations/PageTransition.jsx';

export const CustomBudgetDetailsPage = ({
  budgetId,
  onBack,
  onNavigate,
  onBudgetDeleted,
}) => {
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchBudgetDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [bData, tData] = await Promise.all([
        customBudgetService.getCustomBudgetById(budgetId),
        customBudgetService.getCustomBudgetTransactions(budgetId),
      ]);
      setBudget(bData);
      setTransactions(tData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useEffect(() => {
    if (budgetId) {
      fetchBudgetDetails();
    }
  }, [budgetId, fetchBudgetDetails]);

  const handleAddTransaction = async (data) => {
    try {
      await customBudgetService.addCustomBudgetTransaction({
        ...data,
        customBudgetId: budgetId,
      });
      fetchBudgetDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (txId) => {
    try {
      await customBudgetService.deleteCustomBudgetTransaction(txId);
      fetchBudgetDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBudget = async (data) => {
    try {
      const updated = await customBudgetService.updateCustomBudget(budgetId, data);
      setBudget(updated);
      setIsEditModalOpen(false);
      fetchBudgetDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBudget = async () => {
    if (window.confirm(`Are you sure you want to delete "${budget?.name}" and all its expenses?`)) {
      try {
        await customBudgetService.deleteCustomBudget(budgetId);
        onBudgetDeleted?.(budgetId);
        onBack?.();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading && !budget) {
    return (
      <div className="w-full min-h-screen bg-[#090A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6D1F] animate-spin" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="w-full min-h-screen bg-[#090A0F] flex flex-col items-center justify-center  text-center">
        <p className="text-[#8A92A0] mb-4 text-sm">Budget not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#FF6D1F] text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const iconInfo = getBudgetIcon(budget.name);
  const IconComponent = iconInfo.icon;
  const isOver = budget.isOverBudget || budget.totalSpent > budget.totalBudget;
  const remaining = budget.remaining !== undefined ? budget.remaining : (budget.totalBudget - budget.totalSpent);
  const percentage = budget.percentage !== undefined ? budget.percentage : (budget.totalBudget > 0 ? (budget.totalSpent / budget.totalBudget) * 100 : 0);

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 px-4">
        <PageTransition className="flex-1 flex flex-col">
          <header className="pt-4 pb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-[#14171E] border border-white/[0.06] flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-base font-bold text-white max-w-[180px] truncate text-center">
              {budget.name}
            </h1>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-10 h-10 rounded-2xl bg-[#14171E] border border-white/[0.06] flex items-center justify-center text-[#8A92A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-36 bg-[#1A1F29] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-30"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setIsEditModalOpen(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#F3F4F6] hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#FF6D1F]" />
                      <span>Edit Budget</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        handleDeleteBudget();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#EF4444] hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <main className="flex-1 space-y-4">
            <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: `${iconInfo.color}18`, color: iconInfo.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{budget.name}</h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isOver
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                          : 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                      }`}
                    >
                      {isOver ? 'Exceeded' : 'Active'}
                    </span>
                  </div>
                  {budget.description && (
                    <p className="text-xs text-[#8A92A0] mt-0.5">{budget.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <BudgetProgress percentage={percentage} height="h-2.5" />

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[#8A92A0]">Spent </span>
                    <span className="text-white font-bold">
                      {formatCurrency(budget.totalSpent || 0)}
                    </span>
                    <span className="text-[#525B6D]">
                      {' '}/ {formatCurrency(budget.totalBudget || 0)}
                    </span>
                  </div>
                  <div>
                    {isOver ? (
                      <span className="text-[#EF4444] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Over by {formatCurrency(Math.abs(remaining))}
                      </span>
                    ) : (
                      <span className="text-[#FF6D1F] font-bold">
                        {formatCurrency(remaining)} left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {(budget.startDate || budget.endDate) && (
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-[#8A92A0]">
                  <Calendar className="w-3.5 h-3.5 text-[#FF6D1F]" />
                  <span>
                    {budget.startDate ? formatDate(budget.startDate) : 'Start'}
                    {' → '}
                    {budget.endDate ? formatDate(budget.endDate) : 'Ongoing'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 px-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#FF6D1F]" />
                Expenses ({transactions.length})
              </h3>

              <button
                type="button"
                onClick={() => setIsTxModalOpen(true)}
                className="bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-md shadow-[#FF6D1F]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Expense</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1F29] text-[#8A92A0] flex items-center justify-center mx-auto mb-3">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    No Expenses Recorded
                  </h4>
                  <p className="text-xs text-[#8A92A0] mb-4">
                    Log expenses for {budget.name} to track progress
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsTxModalOpen(true)}
                    className="bg-[#1A1F29] hover:bg-[#222834] border border-white/10 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF6D1F]" />
                    Add First Expense
                  </button>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="w-full bg-[#14171E] border border-white/[0.06] rounded-[22px] p-3.5 flex items-center justify-between group hover:border-white/10 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-white text-xs font-bold leading-tight">
                          {tx.title}
                        </h4>
                        <p className="text-[10.5px] text-[#8A92A0] mt-0.5">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">
                        - {formatCurrency(tx.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(tx._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#EF4444] hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </PageTransition>

        <BottomNavigation
          activeTab="custom-budgets"
          onTabChange={(tab) => onNavigate?.(tab)}
        />

        <CustomBudgetTransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onAddTransaction={handleAddTransaction}
          budgetName={budget.name}
        />

        <CreateBudgetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateBudget}
          initialData={budget}
        />
      </div>
    </div>
  );
};
