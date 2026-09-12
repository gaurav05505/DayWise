import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService.js';

export const useAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [subjectsData, summaryData] = await Promise.all([
        attendanceService.getSubjects(),
        attendanceService.getSummary(),
      ]);
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

  const markPresent = async (id) => {
    try {
      await attendanceService.markPresent(id);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const markAbsent = async (id) => {
    try {
      await attendanceService.markAbsent(id);
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
  };
};
