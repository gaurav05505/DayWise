import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBudget } from '../hooks/useBudget.js';
import { useSettings } from '../hooks/useSettings.js';
import { BudgetHeader } from '../components/budget/BudgetHeader.jsx';
import { BudgetOverview } from '../components/budget/BudgetOverview.jsx';
import { TransactionCard } from '../components/budget/TransactionCard.jsx';
import { QuickMinusModal } from '../components/budget/QuickMinusModal.jsx';
import { SetBudgetModal } from '../components/budget/SetBudgetModal.jsx';
import { EditTransactionModal } from '../components/budget/EditTransactionModal.jsx';
import { AddCustomShortcutModal } from '../components/budget/AddCustomShortcutModal.jsx';
import { MonthlyPlanningModal } from '../components/budget/MonthlyPlanningModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';
import { Wallet } from 'lucide-react';

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
  } = useBudget();
  const { settings } = useSettings();

  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickType, setQuickType] = useState('expense');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const filteredTransactions =
    filterType === 'expense'
      ? expenseTransactions
      : filterType === 'income'
      ? incomeTransactions
      : transactions;

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
    } catch {}
  }, [shortcuts]);

  useEffect(() => {
    try {
      localStorage.setItem('daywise_fixed_expenses', JSON.stringify(fixedExpenses));
    } catch {}
  }, [fixedExpenses]);

  useEffect(() => {
    try {
      localStorage.setItem('daywise_target_savings', String(targetSavings));
    } catch {}
  }, [targetSavings]);

  const handleAddShortcut = (item) => {
    setShortcuts((prev) => [...prev, { ...item, id: Date.now().toString() }]);
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

  const handleSavePlanning = ({ fixedExpenses: newFixed, targetSavings: newSavings }) => {
    setFixedExpenses(newFixed);
    setTargetSavings(newSavings);
  };

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 px-4">
        <PageTransition className="flex-1 flex flex-col">
          <BudgetHeader month={month} year={year} />

          <main className="flex-1 space-y-4">
            <BudgetOverview
              summary={summary}
              month={month}
              year={year}
              shortcuts={shortcuts}
              fixedExpenses={fixedExpenses}
              targetSavings={targetSavings}
              progressCardColor={settings.progressCardColor || '#FF6D1F'}
              showRecommendations={settings.showRecommendations !== false}
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
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-2xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
                  Transactions
                </h3>

                <div className="flex items-center gap-1 bg-[#14171E] border border-white/[0.06] p-0.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-[#FF6D1F] text-white shadow-sm'
                        : 'text-[#8A92A0] hover:text-white'
                    }`}
                  >
                    All ({transactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('expense')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      filterType === 'expense'
                        ? 'bg-[#EF4444] text-white shadow-sm'
                        : 'text-[#8A92A0] hover:text-[#EF4444]'
                    }`}
                  >
                    Spends ({expenseTransactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('income')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      filterType === 'income'
                        ? 'bg-[#10B981] text-white shadow-sm'
                        : 'text-[#8A92A0] hover:text-[#10B981]'
                    }`}
                  >
                    Income ({incomeTransactions.length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {loading && transactions.length === 0 ? (
                  <SkeletonCard count={3} />
                ) : filteredTransactions.length === 0 ? (
                  <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-8 text-center shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Wallet className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      {filterType === 'expense'
                        ? 'No Spends Recorded'
                        : filterType === 'income'
                        ? 'No Income Added'
                        : 'No Transactions Yet'}
                    </h4>
                    <p className="text-xs text-[#8A92A0] max-w-[240px] mx-auto mb-4 leading-relaxed">
                      {filterType === 'expense'
                        ? 'Log your daily spending or use Quick Deduct above.'
                        : filterType === 'income'
                        ? 'Add pocket money, allowance, or salary deposits.'
                        : 'Start recording your daily expenses and income for this month.'}
                    </p>
                    <button
                      type="button"
                      onClick={filterType === 'income' ? openAddMoney : openMinusMoney}
                      className="bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#FF6D1F]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                    >
                      {filterType === 'income' ? '+ Add First Income' : '− Minus First Money'}
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((tx) => (
                      <TransactionCard
                        key={tx._id}
                        transaction={tx}
                        onEditTransaction={(item) => setEditingTransaction(item)}
                        onDeleteTransaction={deleteTransaction}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </main>
        </PageTransition>

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
