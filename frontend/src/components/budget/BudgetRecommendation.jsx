import React, { useState } from 'react';
import { Sparkles, Edit3, Zap, ChevronDown, Home } from 'lucide-react';

export const BudgetRecommendation = ({
  monthlyBudget = 0,
  totalExpenses = 0,
  fixedExpenses = [],
  targetSavings = 0,
  onOpenPlanning,
  onDeductOne,
  onDeductAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalFixed = fixedExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysPassed = today.getDate();
  const daysRemaining = Math.max(1, totalDaysInMonth - daysPassed + 1);

  const safeSpendableTotal = Math.max(0, monthlyBudget - totalFixed - targetSavings);
  const remainingSpendable = safeSpendableTotal - totalExpenses;
  const dailySafeLimit = Math.max(0, Math.floor(remainingSpendable / daysRemaining));

  let advice = '';
  if (monthlyBudget === 0) {
    advice = 'Set your total monthly budget above to get smart daily spend recommendations.';
  } else if (remainingSpendable > 0) {
    advice = `After fixed expenses (₹${totalFixed.toLocaleString()}) & savings goal (₹${targetSavings.toLocaleString()}), you have ₹${remainingSpendable.toLocaleString()} left. You can safely spend ₹${dailySafeLimit}/day for the remaining ${daysRemaining} days.`;
  } else if (remainingSpendable === 0) {
    advice = `You have reached your safe spending limit for this month to achieve your ₹${targetSavings.toLocaleString()} savings target.`;
  } else {
    advice = `You are ₹${Math.abs(remainingSpendable).toLocaleString()} over your safe spend limit to hit your ₹${targetSavings.toLocaleString()} savings goal. Try reducing daily expenses for the next ${daysRemaining} days.`;
  }

  return (
    <div className="w-full bg-[#202020] border border-white/5 rounded-2xl p-3.5 mt-3 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF6B2C] shrink-0" />
          <div>
            <h3 className="text-[13.5px] font-medium text-[#EDEDED]">
              Spend & Savings Plan
            </h3>
            {!isOpen && monthlyBudget > 0 && (
              <span className="text-[11px] text-[#8CFF57]">
                Safe: ₹{dailySafeLimit}/day • Savings: ₹{Number(targetSavings).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-white/5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11.5px] text-[#888888]">Monthly Breakdown</span>
            <button
              type="button"
              onClick={onOpenPlanning}
              className="text-[11.5px] text-[#FF6B2C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 py-2 bg-[#1A1A1A] border border-white/5 rounded-xl px-3 text-[12px]">
            <div>
              <span className="text-[#9A9A9A] block text-[11px]">Fixed (Rent/Rasan)</span>
              <span className="text-[#EDEDED] font-semibold">
                ₹{totalFixed.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#9A9A9A] block text-[11px]">Target Savings</span>
              <span className="text-[#8CFF57] font-semibold">
                ₹{Number(targetSavings).toLocaleString()}
              </span>
            </div>
          </div>

          {fixedExpenses.length > 0 && (
            <div className="my-2.5 space-y-1.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] text-[#888888]">Fixed Items</span>
                {fixedExpenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeductAll(fixedExpenses)}
                    className="bg-[#FF6B2C]/15 hover:bg-[#FF6B2C]/25 active:scale-95 text-[#FF6B2C] text-[11px] font-semibold py-0.5 px-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Deduct All (₹{totalFixed.toLocaleString()})</span>
                  </button>
                )}
              </div>

              {fixedExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-lg px-2.5 py-1.5 text-[12px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#EDEDED]">{item.title}</span>
                    <span className="text-[#9A9A9A] text-[11px]">
                      ₹{Number(item.amount).toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeductOne(item)}
                    className="bg-[#272727] hover:bg-[#333333] active:scale-95 text-[#FF6B2C] text-[11px] font-semibold py-0.5 px-2 rounded-md border border-white/5 transition-all cursor-pointer"
                  >
                    − Deduct
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[12px] text-[#9A9A9A] leading-[17px] mt-2.5">
            {advice}
          </p>
        </div>
      )}
    </div>
  );
};
