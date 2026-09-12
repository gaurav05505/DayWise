import React, { useState } from 'react';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';

export const TransactionCard = ({
  transaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const isIncome = transaction.type === 'income';
  const dateObj = new Date(transaction.date);
  const formattedDate = `${dateObj.getDate()} ${dateObj
    .toLocaleString('en-US', { month: 'short' })
    .toLowerCase()}`;

  return (
    <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex items-center justify-between relative">
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-[2.5px] h-3.5 rounded-full inline-block shrink-0 ${
              isIncome ? 'bg-[#8CFF57]' : 'bg-[#FF6B2C]'
            }`}
          />
          <h4 className="text-[14.5px] font-medium text-[#EDEDED] truncate">
            {transaction.title || (isIncome ? 'Received Money' : 'Spent Money')}
          </h4>
        </div>

        <div className="text-[12px] text-[#9A9A9A]">
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`text-[15px] font-bold tracking-tight ${
            isIncome ? 'text-[#8CFF57]' : 'text-[#EDEDED]'
          }`}
        >
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </span>

        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-[#888888] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 bg-[#242424] border border-white/10 rounded-xl py-1 px-1 shadow-xl min-w-[120px]">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEditTransaction(transaction);
                }}
                className="w-full text-left px-3 py-1.5 text-[12.5px] text-[#EDEDED] hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#9A9A9A]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteTransaction(transaction._id);
                }}
                className="w-full text-left px-3 py-1.5 text-[12.5px] text-[#ff4d4f] hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
