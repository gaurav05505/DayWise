import React from 'react';
import { Sparkles } from 'lucide-react';

export const BudgetRecommendation = ({
  monthlyBudget = 0,
  totalExpenses = 0,
  fixedExpenses = [],
  targetSavings = 0,
}) => {
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
    <div className="w-full bg-[#14161B] border border-white/[0.04] rounded-[28px] p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="w-4 h-4 text-[#55F130]" />
        <h3 className="text-[13.5px] font-bold text-white">
          Budget Recommendation
        </h3>
      </div>
      <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed font-normal">
        {advice}
      </p>
    </div>
  );
};
