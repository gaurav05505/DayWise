import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import {
  formatTime12h,
  getDurationText,
  timeToMinutes,
  getTodayDayName,
} from '../../services/timetableService.js';

export const ClassCard = ({
  classItem,
  onEdit,
  onDelete,
  isNext = false,
}) => {
  const todayName = getTodayDayName();
  const isToday = classItem.day === todayName;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startM = timeToMinutes(classItem.startTime);
  const endM = timeToMinutes(classItem.endTime);

  const isOngoing = isToday && nowMinutes >= startM && nowMinutes < endM;
  const isPast = isToday && nowMinutes >= endM;
  const isUpcoming = isToday && nowMinutes < startM;

  const duration = getDurationText(classItem.startTime, classItem.endTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`w-full bg-[#1D1D1D] border rounded-[22px] p-4 shadow-sm relative transition-all ${
        isOngoing
          ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'border-white/[0.05]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-1.5 h-4 rounded-full inline-block shrink-0 ${
                isOngoing
                  ? 'bg-[#24D366]'
                  : 'bg-white/30'
              }`}
            />
            <h3 className="text-[15px] font-bold text-white truncate tracking-tight">
              {classItem.subjectName}
            </h3>

            {isOngoing && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#24D366]/15 border border-[#24D366]/30 text-[#24D366] text-[10px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24D366] animate-pulse" />
                Live Now
              </span>
            )}

            {isNext && isUpcoming && !isOngoing && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-semibold shrink-0">
                Next Up
              </span>
            )}

            {isPast && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-[#9A9DA8] text-[10px] font-medium shrink-0">
                Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9A9DA8] mt-1.5">
            <div className="flex items-center gap-1 text-white font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#9A9DA8] shrink-0" />
              <span>
                {formatTime12h(classItem.startTime)} - {formatTime12h(classItem.endTime)}
              </span>
            </div>
            {duration && (
              <span className="text-[11px] text-[#9A9DA8] px-1.5 py-0.5 rounded-md bg-white/[0.04]">
                {duration}
              </span>
            )}
          </div>

          {classItem.room && (
            <div className="flex items-center gap-1.5 text-xs text-[#9A9DA8] mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#24D366] shrink-0" />
              <span className="truncate">{classItem.room}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <button
            type="button"
            aria-label="Edit schedule"
            onClick={() => onEdit(classItem)}
            className="w-8 h-8 rounded-full aspect-square bg-white/[0.05] hover:bg-white/10 text-[#9A9DA8] hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 shrink-0"
          >
            <Pencil className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            type="button"
            aria-label="Delete schedule"
            onClick={() => onDelete(classItem)}
            className="w-8 h-8 rounded-full aspect-square bg-white/[0.05] hover:bg-red-500/15 text-[#9A9DA8] hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer active:scale-90 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
