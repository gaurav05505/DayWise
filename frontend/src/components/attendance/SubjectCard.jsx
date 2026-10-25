import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MoreVertical, Trash2, Pencil, Clock } from 'lucide-react';

export const SubjectCard = ({
  subject,
  onMarkPresent,
  onMarkAbsent,
  onEditSubject,
  onDeleteSubject,
  onOpenHistory,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const total = Number(subject.totalClasses) || 0;
  const attended = Number(subject.attendedClasses) || 0;
  const target = Number(subject.target) || 75;
  const percentage = Math.round(
    subject.percentage ?? (total > 0 ? (attended / total) * 100 : 0)
  );

  const isHealthy =
    subject.isTargetMet !== undefined
      ? subject.isTargetMet
      : total === 0
      ? true
      : attended * 100 >= target * total;

  const strokeColor = isHealthy ? '#24D366' : '#F04444';

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  const canBunk = subject.canBunk ?? 0;
  const needToAttend = subject.needToAttend ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenHistory?.(subject)}
      className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[22px] p-4 shadow-xl relative cursor-pointer active:scale-[0.99] transition-transform select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1 h-3.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: strokeColor }}
            />
            <h4 className="text-[15px] sm:text-[16px] font-bold text-[#F4F5F7] truncate tracking-tight">
              {subject.name}
            </h4>
          </div>

          <p className="text-[13px] text-[#9A9DA8] font-medium">
            Attendance :{' '}
            <span className="text-white font-bold ml-1">
              {attended}/{total}
            </span>
          </p>

          <p className="text-[12px] text-[#9A9DA8] mt-1 font-normal">
            {isHealthy ? (
              canBunk > 0 ? (
                <span>You can leave {canBunk} class{canBunk > 1 ? 'es' : ''}</span>
              ) : (
                <span>On track ({target}%)</span>
              )
            ) : (
              <span>Need {needToAttend} class{needToAttend > 1 ? 'es' : ''}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-[58px] h-[58px] shrink-0">
            <svg className="w-[58px] h-[58px] -rotate-90" viewBox="0 0 58 58">
              <circle
                cx="29"
                cy="29"
                r={radius}
                stroke="#242424"
                strokeWidth="4.5"
                fill="transparent"
              />
              <motion.circle
                cx="29"
                cy="29"
                r={radius}
                stroke={strokeColor}
                strokeWidth="4.5"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[12px] font-bold text-white tracking-tight">
              {percentage}%
            </span>
          </div>

          <div
            className="flex flex-col gap-1.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              aria-label="Mark Present"
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkPresent(subject._id);
              }}
              className="w-8 h-8 bg-[#16A34A] hover:bg-[#15803D] rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.button>

            <motion.button
              type="button"
              aria-label="Mark Absent"
              whileTap={{ scale: 0.88 }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAbsent(subject._id);
              }}
              className="w-8 h-8 bg-[#8B0000] hover:bg-[#700000] rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-sm transition-all"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </motion.button>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="More options"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-7 h-8 flex items-center justify-center text-[#9A9DA8] hover:text-white transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-9 z-50 w-36 bg-[#1D1D1D] border border-white/10 rounded-2xl shadow-2xl py-1.5 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onOpenHistory?.(subject);
                      }}
                      className="w-full px-3 py-2 text-xs text-[#9A9DA8] hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#24D366]" />
                      <span>History</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEditSubject?.(subject);
                      }}
                      className="w-full px-3 py-2 text-xs text-[#9A9DA8] hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDeleteSubject?.(subject._id);
                      }}
                      className="w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
