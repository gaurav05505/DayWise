import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AttendanceTrendChart } from './AttendanceTrendChart.jsx';
import { buildAttendanceTimeSeries, PERIODS } from '../../services/analyticsService.js';

export const SubjectDetailModal = ({
  subject,
  onClose,
  target = 75,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  if (!subject) return null;

  const total = Number(subject.totalClasses) || 0;
  const attended = Number(subject.attendedClasses) || 0;
  const missed = Math.max(0, total - attended);
  const percentage = Math.round(
    subject.percentage ?? (total > 0 ? (attended / total) * 100 : 0)
  );

  const isHealthy = subject.isTargetMet !== undefined
    ? subject.isTargetMet
    : total === 0
    ? true
    : attended * 100 >= target * total;

  const canBunk = subject.canBunk ?? 0;
  const needToAttend = subject.needToAttend ?? 0;

  const subjectTimeSeries = buildAttendanceTimeSeries(
    [subject],
    selectedPeriod,
    target,
    subject._id
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center overflow-y-auto px-4 py-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-[390px] bg-[#141414] border border-white/10 rounded-[28px] p-4 sm:p-5 shadow-2xl flex flex-col space-y-4 my-auto select-none"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to overall"
                className="w-8 h-8 rounded-full bg-[#1D1D1D] border border-white/[0.06] flex items-center justify-center text-[#9A9DA8] hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2]" />
              </button>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white truncate">
                  {subject.name}
                </h3>
                <p className="text-[11.5px] text-[#9A9DA8]">
                  Detailed Subject Analytics
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                isHealthy
                  ? 'bg-[#24D366]/15 text-[#24D366] border border-[#24D366]/25'
                  : 'bg-[#F04444]/15 text-[#F04444] border border-[#F04444]/25'
              }`}
            >
              {isHealthy ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              <span>{isHealthy ? 'On Track' : 'Shortage'}</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#1D1D1D] rounded-xl p-2 text-center border border-white/[0.04]">
              <span className="text-[10px] text-[#9A9DA8] block uppercase">Current</span>
              <span
                className={`text-sm font-bold block mt-0.5 ${
                  isHealthy ? 'text-[#24D366]' : 'text-[#F04444]'
                }`}
              >
                {percentage}%
              </span>
            </div>
            <div className="bg-[#1D1D1D] rounded-xl p-2 text-center border border-white/[0.04]">
              <span className="text-[10px] text-[#9A9DA8] block uppercase">Attended</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {attended}
              </span>
            </div>
            <div className="bg-[#1D1D1D] rounded-xl p-2 text-center border border-white/[0.04]">
              <span className="text-[10px] text-[#9A9DA8] block uppercase">Held</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {total}
              </span>
            </div>
            <div className="bg-[#1D1D1D] rounded-xl p-2 text-center border border-white/[0.04]">
              <span className="text-[10px] text-[#9A9DA8] block uppercase">Missed</span>
              <span className="text-sm font-bold text-[#F04444] block mt-0.5">
                {missed}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#1D1D1D] border border-white/[0.05] text-xs">
            <p className="text-[#F4F5F7] font-medium leading-relaxed">
              {isHealthy ? (
                canBunk > 0 ? (
                  <>
                    You can miss <strong className="text-white font-bold">{canBunk}</strong> upcoming class{canBunk > 1 ? 'es' : ''} and still maintain {target}% attendance.
                  </>
                ) : (
                  <>
                    You are right on track at {percentage}%. Avoid missing classes.
                  </>
                )
              ) : (
                <>
                  You need to attend <strong className="text-[#F04444] font-bold">{needToAttend}</strong> consecutive class{needToAttend > 1 ? 'es' : ''} to reach {target}%.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#1D1D1D] border border-white/[0.05] rounded-xl">
            {PERIODS.map((period) => {
              const isSelected = selectedPeriod === period.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center select-none ${
                    isSelected
                      ? 'bg-[#141414] text-white shadow-sm border border-white/[0.08]'
                      : 'text-[#9A9DA8] hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              );
            })}
          </div>

          <AttendanceTrendChart
            title={`${subject.name} Trend`}
            timeSeriesData={subjectTimeSeries}
            target={target}
          />

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#1D1D1D] hover:bg-[#252525] border border-white/[0.06] text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-98"
          >
            Close Subject View
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
