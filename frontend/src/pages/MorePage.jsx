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
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative pb-28 ">
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#14171E] border border-[#FF6D1F]/30 text-white text-xs py-2 px-4 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <PageTransition className="flex-1 flex flex-col">
          <header className="pt-4 pb-2 px-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6D1F] to-[#E85C0D] p-[2px] shadow-lg shadow-[#FF6D1F]/10">
                  <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#FF6D1F]" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF6D1F] rounded-full border-2 border-[#090A0F]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#FF6D1F] uppercase tracking-wider block">
                  DayWise
                </span>
                <h1 className="text-[17px] font-bold text-white tracking-tight">
                  Settings & More
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-4 mt-2">
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
                iconColor="#FF6D1F"
                title="Customize & Targets"
                subtitle={`Target: ${settings.attendanceTarget || 75}% • Theme: ${settings.progressCardColor === '#212121' ? 'Charcoal' : 'Orange'} • Insights: ${settings.showRecommendations !== false ? 'On' : 'Off'}`}
                value={`${settings.attendanceTarget || 75}%`}
                onClick={() => onNavigate?.('customize')}
              />
            </SettingsSection>

            <SettingsSection title="Data & Storage">
              <SettingsItem
                icon={Download}
                iconColor="#FF6D1F"
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
          currentProgressColor={settings.progressCardColor || '#FF6D1F'}
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
