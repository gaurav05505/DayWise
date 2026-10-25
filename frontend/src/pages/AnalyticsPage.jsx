import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance.js';
import { useSettings } from '../hooks/useSettings.js';
import { AnalyticsHeader } from '../components/analytics/AnalyticsHeader.jsx';
import { OverallAttendanceCard } from '../components/analytics/OverallAttendanceCard.jsx';
import { AttendanceTrendChart } from '../components/analytics/AttendanceTrendChart.jsx';
import { SubjectComparisonChart } from '../components/analytics/SubjectComparisonChart.jsx';
import { AttendanceDistributionCard } from '../components/analytics/AttendanceDistributionCard.jsx';
import { SubjectAttendanceList } from '../components/analytics/SubjectAttendanceList.jsx';
import { SubjectDetailModal } from '../components/analytics/SubjectDetailModal.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';
import {
  buildAttendanceTimeSeries,
  getSubjectComparison,
} from '../services/analyticsService.js';

export const AnalyticsPage = ({ onNavigate }) => {
  const { subjects, summary, loading } = useAttendance();
  const { settings } = useSettings();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const target = Number(settings?.attendanceTarget) || 75;

  const timeSeriesData = buildAttendanceTimeSeries(
    subjects,
    selectedPeriod,
    target
  );

  const subjectsComparison = getSubjectComparison(subjects, target);

  const selectedSubject = selectedSubjectId
    ? subjects.find((s) => s._id === selectedSubjectId) || null
    : null;

  return (
    <div className="w-full min-h-screen bg-[#0B0C0F] flex justify-center text-[#F4F5F7]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-32 px-4">
        <PageTransition className="flex-1 flex flex-col">
          <AnalyticsHeader
            onBack={() => onNavigate?.('attendance')}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
          />

          <main className="flex-1 space-y-4">
            <OverallAttendanceCard summary={summary} />

            <AttendanceTrendChart
              title="Overall Attendance Trend"
              timeSeriesData={timeSeriesData}
              target={target}
            />

            <SubjectComparisonChart
              subjectsComparison={subjectsComparison}
              target={target}
              onSelectSubject={(id) => setSelectedSubjectId(id)}
            />

            <AttendanceDistributionCard summary={summary} />

            <SubjectAttendanceList
              subjects={subjects}
              target={target}
              onSelectSubject={(id) => setSelectedSubjectId(id)}
            />
          </main>
        </PageTransition>

        <SubjectDetailModal
          subject={selectedSubject}
          onClose={() => setSelectedSubjectId(null)}
          target={target}
        />
      </div>
    </div>
  );
};
