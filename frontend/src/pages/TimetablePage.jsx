import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTimetable } from '../hooks/useTimetable.js';
import { useAttendance } from '../hooks/useAttendance.js';
import { TimetableHeader } from '../components/timetable/TimetableHeader.jsx';
import { ClassCard } from '../components/timetable/ClassCard.jsx';
import { AddTimetableModal } from '../components/timetable/AddTimetableModal.jsx';
import { DeleteClassModal } from '../components/timetable/DeleteClassModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';
import { CalendarX, Sparkles, Plus } from 'lucide-react';
import { formatTime12h, getTodayDayName } from '../services/timetableService.js';

export const TimetablePage = ({ onNavigate }) => {
  const {
    allClasses,
    selectedDay,
    setSelectedDay,
    dayClasses,
    todayStatus,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass,
  } = useTimetable();

  const { subjects } = useAttendance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const todayName = getTodayDayName();
  const isTodaySelected = selectedDay === todayName;

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
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-36 px-3.5 sm:px-4">
        <PageTransition className="flex-1 flex flex-col space-y-4">
          <TimetableHeader
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onOpenAddModal={handleOpenAdd}
            dayClassesCount={dayClasses.length}
          />

          <main className="flex-1 space-y-3.5">
            {isTodaySelected && todayStatus?.currentClass && (
              <div className="p-3.5 bg-[#14181F] border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider">
                      Happening Right Now
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {todayStatus.currentClass.subjectName}
                      {todayStatus.currentClass.room ? ` • ${todayStatus.currentClass.room}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#8E95A5] shrink-0 font-medium">
                  Ends {formatTime12h(todayStatus.currentClass.endTime)}
                </span>
              </div>
            )}

            {isTodaySelected && !todayStatus?.currentClass && todayStatus?.nextClass && (
              <div className="p-3 bg-[#1D1D1D] border border-white/[0.06] rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-[#8E95A5] truncate">
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
                <div className="w-full bg-[#1D1D1D] border border-white/[0.06] rounded-[28px] p-8 text-center shadow-xl space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mx-auto shadow-inner">
                    <CalendarX className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      No Classes on {selectedDay}
                    </h4>
                    <p className="text-xs text-[#8E95A5] max-w-[240px] mx-auto leading-relaxed">
                      You have no scheduled classes for this day. Tap below to add your lectures, labs, or tutorials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-[#090A0F] text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#22C55E]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add First Class</span>
                  </button>
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
