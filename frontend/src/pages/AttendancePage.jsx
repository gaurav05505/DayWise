import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAttendance } from '../hooks/useAttendance.js';
import { useSettings } from '../hooks/useSettings.js';
import { AttendanceHeader } from '../components/attendance/AttendanceHeader.jsx';
import { AttendanceOverview } from '../components/attendance/AttendanceOverview.jsx';
import { SubjectCard } from '../components/attendance/SubjectCard.jsx';
import { BottomNavigation } from '../components/attendance/BottomNavigation.jsx';
import { AddSubjectModal } from '../components/attendance/AddSubjectModal.jsx';
import { EditSubjectModal } from '../components/attendance/EditSubjectModal.jsx';
import { BulkAttendanceModal } from '../components/attendance/BulkAttendanceModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';
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
  } = useAttendance();
  const { settings } = useSettings();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 ">
        <PageTransition className="flex-1 flex flex-col">
          <AttendanceHeader />

          <main className="flex-1 space-y-4">
            <AttendanceOverview
              summary={summary}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
              progressCardColor={settings.progressCardColor || '#FF6D1F'}
              showRecommendations={settings.showRecommendations !== false}
            />

            {error && (
              <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#FCA5A5] text-xs rounded-2xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-[#8A92A0] uppercase tracking-wider">
                  Your Subjects ({subjects.length})
                </h3>
              </div>

              {loading && subjects.length === 0 ? (
                <SkeletonCard count={3} />
              ) : subjects.length === 0 ? (
                <div className="w-full bg-[#14171E] border border-white/[0.06] rounded-[28px] p-8 text-center shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6D1F]/10 text-[#FF6D1F] flex items-center justify-center mx-auto mb-3 shadow-inner">
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
                    className="bg-[#FF6D1F] hover:bg-[#E85C0D] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#FF6D1F]/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
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
                      onDeleteSubject={deleteSubject}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </main>
        </PageTransition>

        <BottomNavigation
          activeTab="attendance"
          onTabChange={(tab) => onNavigate?.(tab)}
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
      </div>
    </div>
  );
};
