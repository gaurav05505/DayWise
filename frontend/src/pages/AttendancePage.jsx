import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAttendance } from '../hooks/useAttendance.js';
import { useSettings } from '../hooks/useSettings.js';
import { useTimetable } from '../hooks/useTimetable.js';
import { AttendanceHeader } from '../components/attendance/AttendanceHeader.jsx';
import { AttendanceOverview } from '../components/attendance/AttendanceOverview.jsx';
import { CurrentClassCard } from '../components/attendance/CurrentClassCard.jsx';
import { NextClassCard } from '../components/attendance/NextClassCard.jsx';
import { SubjectCard } from '../components/attendance/SubjectCard.jsx';
import { SubjectHistoryModal } from '../components/attendance/SubjectHistoryModal.jsx';
import { AddSubjectModal } from '../components/attendance/AddSubjectModal.jsx';
import { EditSubjectModal } from '../components/attendance/EditSubjectModal.jsx';
import { BulkAttendanceModal } from '../components/attendance/BulkAttendanceModal.jsx';
import { AddWidgetModal } from '../components/attendance/AddWidgetModal.jsx';
import { ConfirmationModal } from '../components/more/ConfirmationModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';
import { syncAttendanceToWidget } from '../plugins/widgetBridge.js';
import { attendanceService } from '../services/attendanceService.js';
import { formatTime12h } from '../services/timetableService.js';
import { BookOpen } from 'lucide-react';

export const AttendancePage = ({ onNavigate }) => {
  const {
    subjects,
    summary,
    loading,
    error,
    addSubject,
    updateSubject,
    markPresent,
    markAbsent,
    markBulkAttendance,
    deleteSubject,
    deleteLog,
  } = useAttendance();
  const { settings } = useSettings();
  const { todayStatus, allClasses } = useTimetable();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [historySubjectId, setHistorySubjectId] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isMarkingQuick, setIsMarkingQuick] = useState(false);

  const activeHistorySubject = subjects.find((s) => s._id === historySubjectId) || null;

  const currentClass = todayStatus?.currentClass || null;
  const matchedSubject = currentClass
    ? subjects.find(
        (s) =>
          s.name.trim().toLowerCase() ===
          currentClass.subjectName.trim().toLowerCase()
      )
    : null;

  const todayDateKey = new Date().toISOString().split('T')[0];
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let markedStatus = null;
  if (matchedSubject && currentClass && Array.isArray(matchedSubject.logs)) {
    const log = matchedSubject.logs.find(
      (l) =>
        l.timetableClassId === currentClass._id &&
        (l.dateKey === todayDateKey || l.date === todayDateStr)
    );
    if (log) {
      markedStatus = log.status;
    }
  }

  const handleConfirmDeleteSubject = async () => {
    if (deletingSubject) {
      const id = deletingSubject._id || deletingSubject;
      await deleteSubject(id);
      setDeletingSubject(null);
    }
  };

  const handleQuickAttendance = async (status) => {
    if (!currentClass) return;
    setIsMarkingQuick(true);
    try {
      let targetSubjectId = matchedSubject?._id;

      if (!targetSubjectId) {
        await addSubject({
          name: currentClass.subjectName.trim(),
          totalClasses: 0,
          attendedClasses: 0,
          color: '#22C55E',
        });
        const refreshed = await attendanceService.getSubjects();
        const found = refreshed.find(
          (s) =>
            s.name.trim().toLowerCase() ===
            currentClass.subjectName.trim().toLowerCase()
        );
        targetSubjectId = found?._id;
      }

      if (targetSubjectId) {
        const meta = {
          timetableClassId: currentClass._id,
          dateKey: todayDateKey,
        };
        if (status === 'present') {
          await markPresent(targetSubjectId, meta);
        } else {
          await markAbsent(targetSubjectId, meta);
        }
      }
    } finally {
      setIsMarkingQuick(false);
    }
  };

  useEffect(() => {
    if (summary) {
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
      } else if (subjects.length > 0) {
        nextClassPayload = { name: subjects[0].name, time: '' };
      }
      syncAttendanceToWidget(
        summary,
        nextClassPayload,
        subjects,
        allClasses,
        settings?.attendanceTarget || 75
      );
    }
  }, [summary, subjects, todayStatus, allClasses, settings]);

  return (
    <div className="w-full min-h-screen bg-[#0B0C0F] flex justify-center text-[#F4F5F7]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-32 px-1">
        <PageTransition className="flex-1 flex flex-col">
          <AttendanceHeader onOpenMenu={() => setIsWidgetModalOpen(true)} />

          <main className="flex-1 space-y-3.5">
            <AttendanceOverview
              summary={summary}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
              onOpenAnalytics={() => onNavigate?.('analytics')}
              progressCardColor={settings.progressCardColor || '#24D366'}
              showRecommendations={false}
            />

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <CurrentClassCard
                currentClass={currentClass}
                matchedSubject={matchedSubject}
                statusLabel={todayStatus?.statusLabel || 'No class right now'}
                markedStatus={markedStatus}
                onMarkAttendance={handleQuickAttendance}
                isMarking={isMarkingQuick}
                nextClass={todayStatus?.nextClass}
                onNavigateToTimetable={() => onNavigate?.('timetable')}
              />

              <NextClassCard
                nextClass={todayStatus?.nextClass}
                nextClassTiming={todayStatus?.nextClassTiming}
                hasAnySchedule={todayStatus?.hasAnySchedule !== false}
                onNavigateToTimetable={() => onNavigate?.('timetable')}
              />
            </div>

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-2xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[18px] sm:text-[19px] font-bold text-[#F4F5F7] tracking-tight">
                  Subject
                </h2>
              </div>

              {loading && subjects.length === 0 ? (
                <SkeletonCard count={3} />
              ) : subjects.length === 0 ? (
                <div className="w-full bg-[#1D1D1D] border border-white/[0.06] rounded-[28px] p-8 text-center shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20 shadow-inner">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    No Subjects Added
                  </h4>
                  <p className="text-xs text-[#8A92A0] max-w-[240px] mx-auto mb-4 leading-relaxed">
                    Add your courses to track classes and keep your attendance on target.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                  >
                    + Add First Subject
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      onMarkPresent={markPresent}
                      onMarkAbsent={markAbsent}
                      onEditSubject={(sub) => setEditingSubject(sub)}
                      onDeleteSubject={(sub) => setDeletingSubject(sub)}
                      onOpenHistory={(sub) => setHistorySubjectId(sub._id)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </main>
        </PageTransition>

        <SubjectHistoryModal
          isOpen={Boolean(activeHistorySubject)}
          subject={activeHistorySubject}
          onClose={() => setHistorySubjectId(null)}
          onDeleteLog={deleteLog}
        />

        <AddSubjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSubject={addSubject}
        />

        <EditSubjectModal
          isOpen={Boolean(editingSubject)}
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onUpdateSubject={updateSubject}
        />

        <BulkAttendanceModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          subjects={subjects}
          onMarkBulkAttendance={markBulkAttendance}
        />

        <AddWidgetModal
          isOpen={isWidgetModalOpen}
          onClose={() => setIsWidgetModalOpen(false)}
          summary={summary}
        />

        <ConfirmationModal
          isOpen={Boolean(deletingSubject)}
          onClose={() => setDeletingSubject(null)}
          onConfirm={handleConfirmDeleteSubject}
          title={`Delete ${deletingSubject?.name || 'Subject'}?`}
          message="Are you sure you want to delete this subject? All attendance records for this subject will be permanently removed."
          confirmLabel="Delete Subject"
        />
      </div>
    </div>
  );
};
