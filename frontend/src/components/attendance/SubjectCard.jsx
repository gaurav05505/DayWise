import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MoreVertical, Trash2, Pencil } from 'lucide-react';

export const SubjectCard = ({
  subject,
  onMarkPresent,
  onMarkAbsent,
  onEditSubject,
  onDeleteSubject,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const percentage = Math.round(subject.percentage ?? subject.attendancePercentage ?? 0);
  const target = subject.target || 75;
  const isHealthy = percentage >= target;
  const color = isHealthy ? '#FF6D1F' : '#EF4444';

  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  const canBunk = subject.canBunk ?? 0;
  const needToAttend = subject.needToAttend ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-[#14171E] border border-white/[0.06] rounded-[24px] p-4 shadow-lg relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: color }}
            />
            <h4 className="text-[15px] font-bold text-white truncate tracking-tight">
              {subject.name}
            </h4>
          </div>

          <p className="text-[12.5px] text-[#8A92A0] mb-1.5">
            Attended:{' '}
            <span className="text-white font-bold text-[13.5px]">
              {subject.attendedClasses}
            </span>
            <span className="text-[#64748B]"> / {subject.totalClasses} classes</span>
          </p>

          <div>
            {canBunk > 0 ? (
              <span className="text-[11px] font-bold text-[#FF6D1F] bg-[#FF6D1F]/10 px-2.5 py-0.5 rounded-full inline-block">
                Can leave {canBunk} class{canBunk > 1 ? 'es' : ''}
              </span>
            ) : needToAttend > 0 ? (
              <span className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-0.5 rounded-full inline-block">
                Need {needToAttend} class{needToAttend > 1 ? 'es' : ''}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-0.5 rounded-full inline-block">
                On track ({target}%)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-[56px] h-[56px] shrink-0">
            <svg className="w-[56px] h-[56px] -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#1F242D"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                stroke={color}
                strokeWidth="4"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[12.5px] font-bold text-white tracking-tight">
              {percentage}%
            </span>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 pl-1">
            <motion.button
              type="button"
              aria-label="Mark Present"
              whileTap={{ scale: 0.88 }}
              onClick={() => onMarkPresent(subject._id)}
              className="w-8 h-8 bg-[#10B981] hover:bg-[#059669] rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.button>

            <motion.button
              type="button"
              aria-label="Mark Absent"
              whileTap={{ scale: 0.88 }}
              onClick={() => onMarkAbsent(subject._id)}
              className="w-8 h-8 bg-[#EF4444] hover:bg-[#DC2626] rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-sm transition-all"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </motion.button>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="More options"
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
                      onEditSubject(subject);
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
                      onDeleteSubject(subject._id);
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
      </div>
    </motion.div>
  );
};
