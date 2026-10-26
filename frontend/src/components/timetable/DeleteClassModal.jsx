import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/modalVariants.js';
import { formatTime12h } from '../../services/timetableService.js';

export const DeleteClassModal = ({
  isOpen,
  onClose,
  onConfirm,
  classItem,
}) => {
  if (!classItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-[340px] bg-[#1D1D1D] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full aspect-square bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Remove Class?
                </h3>
                <p className="text-[11px] text-[#9A9DA8]">
                  Delete from {classItem.day} schedule
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/30 border border-white/[0.05] rounded-2xl space-y-1">
              <p className="text-xs font-bold text-white">
                {classItem.subjectName}
              </p>
              <p className="text-[11px] text-[#9A9DA8]">
                {formatTime12h(classItem.startTime)} - {formatTime12h(classItem.endTime)}
                {classItem.room ? ` • ${classItem.room}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/[0.05] hover:bg-white/10 text-[#9A9DA8] hover:text-white text-xs font-semibold py-3 rounded-2xl transition-all cursor-pointer border border-white/[0.05]"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm(classItem._id);
                  onClose();
                }}
                className="flex-1 bg-[#F04444] hover:bg-red-500 text-white text-xs font-bold py-3 rounded-2xl shadow-lg shadow-red-950/40 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
