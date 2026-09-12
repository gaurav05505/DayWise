import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance.js';
import { AttendanceHeader } from '../components/attendance/AttendanceHeader.jsx';
import { AttendanceOverview } from '../components/attendance/AttendanceOverview.jsx';
import { SubjectCard } from '../components/attendance/SubjectCard.jsx';
import { BottomNavigation } from '../components/attendance/BottomNavigation.jsx';
import { AddSubjectModal } from '../components/attendance/AddSubjectModal.jsx';
import { EditSubjectModal } from '../components/attendance/EditSubjectModal.jsx';
import { BulkAttendanceModal } from '../components/attendance/BulkAttendanceModal.jsx';

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#121212] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 px-1">
        <AttendanceHeader />

        <main className="flex-1">
          <AttendanceOverview
            summary={summary}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
          />

          {error && (
            <div className="mt-4 bg-[#B90F14]/20 border border-[#B90F14]/40 text-[#ff7875] text-[12.5px] rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          <div className="mt-4 space-y-3.5">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[#8CFF57] border-t-transparent rounded-full animate-spin" />
                <span className="text-[12.5px] text-[#888888]">Loading subjects...</span>
              </div>
            ) : subjects.length === 0 ? (
              <div className="w-full bg-[#181818] border border-white/5 rounded-2xl p-6 text-center mt-3">
                <p className="text-[13.5px] text-[#9A9A9A] mb-3">
                  No subjects added yet
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#FF6B2C] hover:bg-[#ff5814] text-white text-[13px] font-medium py-2 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  + Add First Subject
                </button>
              </div>
            ) : (
              subjects.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onMarkPresent={markPresent}
                  onMarkAbsent={markAbsent}
                  onEditSubject={(sub) => setEditingSubject(sub)}
                  onDeleteSubject={deleteSubject}
                />
              ))
            )}
          </div>
        </main>

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
