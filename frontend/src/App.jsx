import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { TimetablePage } from './pages/TimetablePage.jsx';
import { MorePage } from './pages/MorePage.jsx';
import { CustomizePage } from './pages/CustomizePage.jsx';
import { BottomNavigation } from './components/attendance/BottomNavigation.jsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.jsx';
import { SplashScreen } from './components/animations/SplashScreen.jsx';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('attendance');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const getActiveNavTab = () => {
    if (currentPage === 'customize') return 'more';
    return currentPage;
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <OfflineIndicator />

      <AnimatePresence mode="wait">
        {currentPage === 'attendance' && (
          <AttendancePage key="attendance" onNavigate={handleNavigate} />
        )}
        {currentPage === 'timetable' && (
          <TimetablePage key="timetable" onNavigate={handleNavigate} />
        )}
        {currentPage === 'more' && (
          <MorePage key="more" onNavigate={handleNavigate} />
        )}
        {currentPage === 'customize' && (
          <CustomizePage
            key="customize"
            onBack={() => setCurrentPage('more')}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <BottomNavigation
          activeTab={getActiveNavTab()}
          onTabChange={handleNavigate}
        />
      )}
    </>
  );
};

export default App;
