import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Trash2, Pencil, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const TransactionCard = ({
  transaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const isIncome = transaction.type === 'income';
  const dateObj = new Date(transaction.date);
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 flex items-center justify-between relative shadow-lg"
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isIncome ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>

        <div className="min-w-0">
          <h4 className="text-[14.5px] font-bold text-white truncate tracking-tight">
            {transaction.title || (isIncome ? 'Received Money' : 'Spent Money')}
          </h4>
          <span className="text-[11.5px] text-[#8A92A0]">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span
          className={`text-[15px] font-black tracking-tight ${
            isIncome ? 'text-[#10B981]' : 'text-white'
          }`}
        >
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </span>

        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-[#64748B] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-8 z-30 bg-[#1A1F29] border border-white/10 rounded-2xl py-1.5 px-1 shadow-2xl min-w-[125px]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEditTransaction(transaction);
                  }}
                  className="w-full text-left px-3 py-2 text-[12.5px] text-[#F3F4F6] hover:bg-white/5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#FF6D1F]" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteTransaction(transaction._id);
                  }}
                  className="w-full text-left px-3 py-2 text-[12.5px] text-[#EF4444] hover:bg-white/5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
