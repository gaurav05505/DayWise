import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTimetable } from '../hooks/useTimetable.js';
import { useAttendance } from '../hooks/useAttendance.js';
import { TimetableHeader } from '../components/timetable/TimetableHeader.jsx';
import { ClassCard } from '../components/timetable/ClassCard.jsx';
import { AddTimetableModal } from '../components/timetable/AddTimetableModal.jsx';
import { DeleteClassModal } from '../components/timetable/DeleteClassModal.jsx';
import { WeekPlanModal } from '../components/timetable/WeekPlanModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';
import { CalendarX, Sparkles, Plus, Layers } from 'lucide-react';
import { formatTime12h, getTodayDayName } from '../services/timetableService.js';
import { syncAttendanceToWidget } from '../plugins/widgetBridge.js';

export const TimetablePage = ({ onNavigate }) => {
  const {
    allClasses,
    selectedDay,
    setSelectedDay,
    dayClasses,
    todayStatus,
    weeklySummary,
    loading,
    error,
    addClass,
    copyDaySchedule,
    updateClass,
    deleteClass,
  } = useTimetable();

  const { subjects, summary } = useAttendance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWeekPlanOpen, setIsWeekPlanOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const todayName = getTodayDayName();
  const isTodaySelected = selectedDay === todayName;

  useEffect(() => {
    if (allClasses && subjects) {
      let nextClassPayload = null;
      if (todayStatus?.currentClass) {
        nextClassPayload = {
          name: todayStatus.currentClass.subjectName,
          time: `Now (ends ${formatTime12h(todayStatus.currentClass.endTime)})`,
        };
      } else if (todayStatus?.nextClass) {
        nextClassPayload = {
          name: todayStatus.nextClass.subjectName,
          time: formatTime12h(todayStatus.nextClass.startTime),
        };
      }
      syncAttendanceToWidget(
        summary,
        nextClassPayload,
        subjects,
        allClasses,
        75
      );
    }
  }, [allClasses, subjects, todayStatus, summary]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingClass(item);
    setIsAddModalOpen(true);
  };

  const handleSaveSchedule = async (data) => {
    if (editingClass) {
      return updateClass(editingClass._id, data);
    }
    return addClass(data);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0C0F] flex justify-center text-[#F4F5F7]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-32 px-1">
        <PageTransition className="flex-1 flex flex-col space-y-3.5">
          <TimetableHeader
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onOpenAddModal={handleOpenAdd}
            onOpenWeekPlan={() => setIsWeekPlanOpen(true)}
            dayClassesCount={dayClasses.length}
          />

          <main className="flex-1 space-y-3">
            {isTodaySelected && todayStatus?.currentClass && (
              <div className="p-3.5 bg-[#1D1D1D] border border-emerald-500/30 rounded-[20px] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#24D366] animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold text-[#24D366] uppercase tracking-wider">
                      Happening Right Now
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {todayStatus.currentClass.subjectName}
                      {todayStatus.currentClass.room ? ` • ${todayStatus.currentClass.room}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#9A9DA8] shrink-0 font-medium">
                  Ends {formatTime12h(todayStatus.currentClass.endTime)}
                </span>
              </div>
            )}

            {isTodaySelected && !todayStatus?.currentClass && todayStatus?.nextClass && (
              <div className="p-3 bg-[#1D1D1D] border border-white/[0.05] rounded-[20px] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#24D366] shrink-0" />
                  <p className="text-xs text-[#9A9DA8] truncate">
                    Next:{' '}
                    <strong className="text-white">
                      {todayStatus.nextClass.subjectName}
                    </strong>{' '}
                    at {formatTime12h(todayStatus.nextClass.startTime)}
                    {todayStatus.nextClass.room ? ` (${todayStatus.nextClass.room})` : ''}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-2xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {loading && dayClasses.length === 0 ? (
                <SkeletonCard count={3} />
              ) : dayClasses.length === 0 ? (
                <div className="w-full bg-[#1D1D1D] border border-white/[0.05] rounded-[24px] p-7 text-center shadow-sm space-y-3.5">
                  <div className="w-12 h-12 rounded-full aspect-square bg-[#24D366]/10 border border-[#24D366]/20 text-[#24D366] flex items-center justify-center mx-auto shrink-0 shadow-inner">
                    <CalendarX className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      No Classes on {selectedDay}
                    </h4>
                    <p className="text-[11.5px] text-[#9A9DA8] max-w-[250px] mx-auto leading-relaxed">
                      You have no scheduled classes for this day. You can add a single subject or create your full recurring weekly plan.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="bg-[#24D366] hover:bg-[#16A34A] text-[#0B0C0F] text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Add Subject</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWeekPlanOpen(true)}
                      className="bg-white/[0.05] hover:bg-white/10 text-white border border-white/[0.08] text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#24D366]" />
                      <span>Plan Week</span>
                    </button>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {dayClasses.map((item) => (
                    <ClassCard
                      key={item._id}
                      classItem={item}
                      onEdit={handleOpenEdit}
                      onDelete={(it) => setDeletingClass(it)}
                      isNext={todayStatus?.nextClass?._id === item._id}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </main>
        </PageTransition>

        <AddTimetableModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveSchedule}
          initialDay={selectedDay}
          editingClass={editingClass}
          dayClasses={dayClasses}
          subjectSuggestions={subjects}
        />

        <WeekPlanModal
          isOpen={isWeekPlanOpen}
          onClose={() => setIsWeekPlanOpen(false)}
          allClasses={allClasses}
          weeklySummary={weeklySummary}
          onOpenAddModal={handleOpenAdd}
          onCopyDaySchedule={copyDaySchedule}
          onSelectDay={(d) => setSelectedDay(d)}
        />

        <DeleteClassModal
          isOpen={Boolean(deletingClass)}
          onClose={() => setDeletingClass(null)}
          onConfirm={(id) => deleteClass(id)}
          classItem={deletingClass}
        />
      </div>
    </div>
  );
};

