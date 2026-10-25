import { useState, useEffect, useCallback, useMemo } from 'react';
import { timetableService, getTodayDayName } from '../services/timetableService.js';

export const useTimetable = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [selectedDay, setSelectedDay] = useState(getTodayDayName());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timetableService.getAllClasses();
      setAllClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const [timeTick, setTimeTick] = useState(Date.now());

  useEffect(() => {
    fetchClasses();

    const timer = setInterval(() => {
      setTimeTick(Date.now());
    }, 30000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setTimeTick(Date.now());
        fetchClasses();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibility);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleVisibility);
    }

    return () => {
      clearInterval(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibility);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleVisibility);
      }
    };
  }, [fetchClasses]);

  const dayClasses = useMemo(() => {
    return allClasses
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [allClasses, selectedDay]);

  const todayStatus = useMemo(() => {
    return timetableService.getCurrentAndNextClass(allClasses);
  }, [allClasses, timeTick]);

  const addClass = async (data) => {
    try {
      await timetableService.addClass(data);
      await fetchClasses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateClass = async (id, data) => {
    try {
      await timetableService.updateClass(id, data);
      await fetchClasses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteClass = async (id) => {
    try {
      await timetableService.deleteClass(id);
      await fetchClasses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
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
    refresh: fetchClasses,
  };
};

