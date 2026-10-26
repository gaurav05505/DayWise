import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService.js';
import { getPendingWidgetActions, clearPendingWidgetActions } from '../plugins/widgetBridge.js';

export const useAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processPendingWidgetActions = async (currentSubjects) => {
    try {
      const actions = await getPendingWidgetActions();
      if (!actions || actions.length === 0) return false;

      let changed = false;
      for (const act of actions) {
        const sub = currentSubjects.find(
          (s) =>
            (act.subjectId && s._id === act.subjectId) ||
            s.name.trim().toLowerCase() === (act.subjectName || '').trim().toLowerCase()
        );

        if (sub) {
          const alreadyLogged = Array.isArray(sub.logs) && sub.logs.some(
            (l) =>
              l.timetableClassId === act.timetableClassId &&
              (l.dateKey === act.dateKey || l.date === act.date)
          );

          if (!alreadyLogged) {
            const meta = {
              timetableClassId: act.timetableClassId,
              dateKey: act.dateKey,
              date: act.date,
            };
            if (act.status === 'present') {
              await attendanceService.markPresent(sub._id, meta);
            } else {
              await attendanceService.markAbsent(sub._id, meta);
            }
            changed = true;
          }
        }
      }

      await clearPendingWidgetActions();
      return changed;
    } catch (err) {
      console.error('Error processing widget actions:', err);
      return false;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let [subjectsData, summaryData] = await Promise.all([
        attendanceService.getSubjects(),
        attendanceService.getSummary(),
      ]);

      const hadPending = await processPendingWidgetActions(subjectsData);
      if (hadPending) {
        [subjectsData, summaryData] = await Promise.all([
          attendanceService.getSubjects(),
          attendanceService.getSummary(),
        ]);
      }

      setSubjects(subjectsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          fetchData();
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [fetchData]);

  const addSubject = async (data) => {
    try {
      await attendanceService.createSubject(data);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateSubject = async (id, data) => {
    try {
      await attendanceService.updateSubject(id, data);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markPresent = async (id, meta = {}) => {
    try {
      await attendanceService.markPresent(id, meta);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const markAbsent = async (id, meta = {}) => {
    try {
      await attendanceService.markAbsent(id, meta);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const markBulkAttendance = async (attendanceList) => {
    try {
      await attendanceService.markBulkAttendance(attendanceList);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await attendanceService.deleteSubject(id);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteLog = async (subjectId, logId) => {
    try {
      await attendanceService.deleteLog(subjectId, logId);
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    subjects,
    summary,
    loading,
    error,
    refreshData: fetchData,
    addSubject,
    updateSubject,
    markPresent,
    markAbsent,
    markBulkAttendance,
    deleteSubject,
    deleteLog,
  };
};
