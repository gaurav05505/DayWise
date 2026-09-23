import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService.js';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  attendanceTarget: 75,
  progressCardColor: '#55F130',
  showRecommendations: true,
};

let cachedSettings = (() => {
  try {
    const stored = localStorage.getItem('daywise_settings_cache');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
})();

const listeners = new Set();

const notifyListeners = (newSettings) => {
  cachedSettings = newSettings;
  try {
    localStorage.setItem('daywise_settings_cache', JSON.stringify(newSettings));
  } catch {}
  listeners.forEach((fn) => fn(newSettings));
};

export const useSettings = () => {
  const [settings, setSettings] = useState(cachedSettings);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchSettings = useCallback(async () => {
    const data = await settingsService.getSettings();
    const merged = { ...DEFAULT_SETTINGS, ...data };
    notifyListeners(merged);
  }, []);

  useEffect(() => {
    const listener = (newVal) => setSettings(newVal);
    listeners.add(listener);
    fetchSettings();
    return () => {
      listeners.delete(listener);
    };
  }, [fetchSettings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const updateSetting = async (key, value) => {
    const optimistic = { ...cachedSettings, [key]: value };
    notifyListeners(optimistic);
    const updated = await settingsService.saveSettings({ [key]: value });
    notifyListeners({ ...DEFAULT_SETTINGS, ...updated });
  };

  const updateMultipleSettings = async (newSettingsObj) => {
    const optimistic = { ...cachedSettings, ...newSettingsObj };
    notifyListeners(optimistic);
    const updated = await settingsService.saveSettings(newSettingsObj);
    notifyListeners({ ...DEFAULT_SETTINGS, ...updated });
  };

  const exportData = async () => {
    setLoading(true);
    const result = await settingsService.exportAllData();
    setLoading(false);
    if (result.success) {
      showToast('Data exported successfully');
    } else {
      showToast('Failed to export data');
    }
  };

  const importData = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const result = await settingsService.importData(parsed);
          if (result.success) {
            await fetchSettings();
            showToast('Data imported successfully');
            resolve(true);
          } else {
            showToast('Failed to import data');
            resolve(false);
          }
        } catch {
          showToast('Invalid backup file');
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  };

  const resetAttendance = async () => {
    setLoading(true);
    const result = await settingsService.resetAttendanceData();
    setLoading(false);
    if (result.success) {
      showToast('Attendance data reset');
    } else {
      showToast('Failed to reset attendance data');
    }
    return result;
  };

  const resetBudget = async () => {
    setLoading(true);
    const result = await settingsService.resetBudgetData();
    setLoading(false);
    if (result.success) {
      showToast('Budget data reset');
    } else {
      showToast('Failed to reset budget data');
    }
    return result;
  };

  return {
    settings,
    loading,
    toastMessage,
    updateSetting,
    updateMultipleSettings,
    exportData,
    importData,
    resetAttendance,
    resetBudget,
  };
};
