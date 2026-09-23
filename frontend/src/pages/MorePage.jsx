import React, { useState, useRef } from 'react';
import {
  Moon,
  Target,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings.js';
import { SettingsSection } from '../components/more/SettingsSection.jsx';
import { SettingsItem } from '../components/more/SettingsItem.jsx';
import { ThemeSelector } from '../components/more/ThemeSelector.jsx';
import { AttendanceTargetModal } from '../components/more/AttendanceTargetModal.jsx';
import { ConfirmationModal } from '../components/more/ConfirmationModal.jsx';
import { AboutSection } from '../components/more/AboutSection.jsx';
import { PageTransition } from '../components/animations/PageTransition.jsx';

export const MorePage = ({ onNavigate }) => {
  const {
    settings,
    toastMessage,
    updateSetting,
    updateMultipleSettings,
    exportData,
    importData,
    resetAttendance,
    resetBudget,
  } = useSettings();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [resetModalType, setResetModalType] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await importData(file);
      e.target.value = '';
    }
  };

  const getThemeDisplayName = (themeId) => {
    if (themeId === 'light') return 'Light';
    if (themeId === 'system') return 'System';
    return 'Dark';
  };

  return (
    <div className="w-full min-h-screen bg-[#090A0F] flex justify-center text-[#F3F4F6]">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-36 px-1">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] bg-[#14161B] border border-[#55F130]/30 text-white text-xs py-2 px-4 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#55F130]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <PageTransition className="flex-1 flex flex-col">
          <header className="pt-5 pb-3 px-1 flex items-center justify-between">
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              Settings & More
            </h1>
          </header>

          <main className="flex-1 space-y-4">
            <SettingsSection title="App Settings">
              <SettingsItem
                icon={Moon}
                iconColor="#8A92A0"
                title="Theme"
                subtitle="Visual appearance"
                value={getThemeDisplayName(settings.theme)}
                onClick={() => setIsThemeModalOpen(true)}
              />
              <SettingsItem
                icon={Target}
                iconColor="#55F130"
                title="Customize & Targets"
                subtitle={`Target: ${settings.attendanceTarget || 75}% • Theme: ${settings.progressCardColor === '#212121' ? 'Charcoal' : 'Neon'} • Insights: ${settings.showRecommendations !== false ? 'On' : 'Off'}`}
                value={`${settings.attendanceTarget || 75}%`}
                onClick={() => onNavigate?.('customize')}
              />
            </SettingsSection>

            <SettingsSection title="Data & Storage">
              <SettingsItem
                icon={Download}
                iconColor="#55F130"
                title="Export Data"
                subtitle="Save local backup JSON"
                onClick={exportData}
              />
              <SettingsItem
                icon={Upload}
                iconColor="#38BDF8"
                title="Import Data"
                subtitle="Restore data backup"
                onClick={() => fileInputRef.current?.click()}
              />
              <SettingsItem
                icon={Trash2}
                title="Reset Attendance Data"
                subtitle="Clear all attendance courses"
                isDestructive={true}
                onClick={() => setResetModalType('attendance')}
              />
              <SettingsItem
                icon={Trash2}
                title="Reset Budget Data"
                subtitle="Clear budget & transactions"
                isDestructive={true}
                onClick={() => setResetModalType('budget')}
              />
            </SettingsSection>

            <AboutSection />
          </main>
        </PageTransition>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <ThemeSelector
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentTheme={settings.theme}
          onSelectTheme={(theme) => updateSetting('theme', theme)}
        />

        <AttendanceTargetModal
          isOpen={isTargetModalOpen}
          onClose={() => setIsTargetModalOpen(false)}
          currentTarget={settings.attendanceTarget || 75}
          currentProgressColor={settings.progressCardColor || '#55F130'}
          currentShowRecommendations={settings.showRecommendations !== false}
          onSavePreferences={(prefs) => updateMultipleSettings(prefs)}
        />

        <ConfirmationModal
          isOpen={resetModalType === 'attendance'}
          onClose={() => setResetModalType(null)}
          onConfirm={resetAttendance}
          title="Reset Attendance Data?"
          message="This will permanently delete all your subjects and attendance records. This action cannot be undone."
          confirmLabel="Reset Attendance"
        />

        <ConfirmationModal
          isOpen={resetModalType === 'budget'}
          onClose={() => setResetModalType(null)}
          onConfirm={resetBudget}
          title="Reset Budget Data?"
          message="This will permanently delete your monthly budget and transaction history. This action cannot be undone."
          confirmLabel="Reset Budget"
        />
      </div>
    </div>
  );
};
