import React, { useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget.js';
import { BudgetHeader } from '../components/budget/BudgetHeader.jsx';
import { BudgetOverview } from '../components/budget/BudgetOverview.jsx';
import { TransactionCard } from '../components/budget/TransactionCard.jsx';
import { BottomNavigation } from '../components/attendance/BottomNavigation.jsx';
import { QuickMinusModal } from '../components/budget/QuickMinusModal.jsx';
import { SetBudgetModal } from '../components/budget/SetBudgetModal.jsx';
import { EditTransactionModal } from '../components/budget/EditTransactionModal.jsx';
import { AddCustomShortcutModal } from '../components/budget/AddCustomShortcutModal.jsx';
import { MonthlyPlanningModal } from '../components/budget/MonthlyPlanningModal.jsx';

export const BudgetPage = ({ onNavigate }) => {
  const {
    month,
    year,
    transactions,
    summary,
    categories,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setMonthlyBudget,
    refreshData,
  } = useBudget();

  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickType, setQuickType] = useState('expense');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const defaultShortcuts = [
    { id: '1', label: 'Chai', amount: 10 },
    { id: '2', label: 'Snacks', amount: 50 },
    { id: '3', label: 'Auto', amount: 30 },
  ];

  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem('daywise_custom_shortcuts');
      return saved ? JSON.parse(saved) : defaultShortcuts;
    } catch {
      return defaultShortcuts;
    }
  });

  const defaultFixedExpenses = [
    { id: '1', title: 'Room Rent', amount: 3000 },
    { id: '2', title: 'Rasan / Mess', amount: 2500 },
  ];

  const [fixedExpenses, setFixedExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('daywise_fixed_expenses');
      return saved ? JSON.parse(saved) : defaultFixedExpenses;
    } catch {
      return defaultFixedExpenses;
    }
  });

  const [targetSavings, setTargetSavings] = useState(() => {
    try {
      const saved = localStorage.getItem('daywise_target_savings');
      return saved ? Number(saved) : 1500;
    } catch {
      return 1500;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('daywise_custom_shortcuts', JSON.stringify(shortcuts));
    } catch {
      // ignore
    }
  }, [shortcuts]);

  useEffect(() => {
    try {
      localStorage.setItem('daywise_fixed_expenses', JSON.stringify(fixedExpenses));
      localStorage.setItem('daywise_target_savings', String(targetSavings));
    } catch {
      // ignore
    }
  }, [fixedExpenses, targetSavings]);

  const handleSavePlanning = ({ targetSavings: newSavings, fixedExpenses: newFixed }) => {
    setTargetSavings(newSavings);
    setFixedExpenses(newFixed);
  };

  const handleAddShortcut = (newBtn) => {
    setShortcuts((prev) => [...prev, newBtn]);
  };

  const handleDeleteShortcut = (id) => {
    setShortcuts((prev) => prev.filter((item) => item.id !== id));
  };

  const openMinusMoney = () => {
    setQuickType('expense');
    setIsQuickModalOpen(true);
  };

  const openAddMoney = () => {
    setQuickType('income');
    setIsQuickModalOpen(true);
  };

  const handleDirectMinus = async (amt, label) => {
    await addTransaction({
      amount: amt,
      type: 'expense',
      title: label || `Spent ₹${amt}`,
    });
  };

  const handleDeductOne = async (item) => {
    await addTransaction({
      amount: Number(item.amount),
      type: 'expense',
      title: item.title,
    });
  };

  const handleDeductAll = async (list) => {
    for (const item of list) {
      await addTransaction({
        amount: Number(item.amount),
        type: 'expense',
        title: item.title,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#121212] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 px-1">
        <BudgetHeader month={month} year={year} />

        <main className="flex-1">
          <BudgetOverview
            summary={summary}
            month={month}
            year={year}
            shortcuts={shortcuts}
            fixedExpenses={fixedExpenses}
            targetSavings={targetSavings}
            onOpenQuickMinus={openMinusMoney}
            onOpenQuickAdd={openAddMoney}
            onOpenSetBudget={() => setIsBudgetModalOpen(true)}
            onOpenCustomShortcuts={() => setIsShortcutModalOpen(true)}
            onOpenPlanning={() => setIsPlanningModalOpen(true)}
            onDirectMinus={handleDirectMinus}
            onDeductOne={handleDeductOne}
            onDeductAll={handleDeductAll}
          />

          {error && (
            <div className="mt-4 bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[14.5px] font-medium text-[#EDEDED]">
                Recent Transactions
              </h3>
              <span className="text-[12px] text-[#9A9A9A]">
                {transactions.length} items
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#8CFF57] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12.5px] text-[#888888]">
                    Loading transactions...
                  </span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="w-full bg-[#181818] border border-white/5 rounded-2xl p-6 text-center">
                  <p className="text-[13.5px] text-[#9A9A9A] mb-3">
                    No transactions recorded for this month
                  </p>
                  <button
                    type="button"
                    onClick={openMinusMoney}
                    className="bg-[#FF6B2C] hover:bg-[#ff5814] text-white text-[13px] font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    − Minus First Money
                  </button>
                </div>
              ) : (
                transactions.map((tx) => (
                  <TransactionCard
                    key={tx._id}
                    transaction={tx}
                    onEditTransaction={(item) => setEditingTransaction(item)}
                    onDeleteTransaction={deleteTransaction}
                  />
                ))
              )}
            </div>
          </div>
        </main>

        <BottomNavigation
          activeTab="budget"
          onTabChange={(tab) => onNavigate?.(tab)}
        />

        <QuickMinusModal
          isOpen={isQuickModalOpen}
          onClose={() => setIsQuickModalOpen(false)}
          initialType={quickType}
          onAddTransaction={addTransaction}
        />

        <SetBudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          currentBudget={summary?.monthlyBudget ?? 0}
          month={month}
          year={year}
          onSetBudget={setMonthlyBudget}
        />

        <EditTransactionModal
          isOpen={Boolean(editingTransaction)}
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onUpdateTransaction={updateTransaction}
        />

        <AddCustomShortcutModal
          isOpen={isShortcutModalOpen}
          onClose={() => setIsShortcutModalOpen(false)}
          shortcuts={shortcuts}
          onAddShortcut={handleAddShortcut}
          onDeleteShortcut={handleDeleteShortcut}
        />

        <MonthlyPlanningModal
          isOpen={isPlanningModalOpen}
          onClose={() => setIsPlanningModalOpen(false)}
          fixedExpenses={fixedExpenses}
          targetSavings={targetSavings}
          onSavePlanning={handleSavePlanning}
        />
      </div>
    </div>
  );
};
