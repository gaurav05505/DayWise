import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { BudgetPage } from './pages/BudgetPage.jsx';
import { CustomBudgetsPage } from './pages/CustomBudgetsPage.jsx';
import { CustomBudgetDetailsPage } from './pages/CustomBudgetDetailsPage.jsx';
import { MorePage } from './pages/MorePage.jsx';
import { CustomizePage } from './pages/CustomizePage.jsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.jsx';
import { SplashScreen } from './components/animations/SplashScreen.jsx';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('attendance');
  const [selectedCustomBudgetId, setSelectedCustomBudgetId] = useState(null);

  const handleNavigate = (page) => {
    setSelectedCustomBudgetId(null);
    setCurrentPage(page);
  };

  const handleSelectCustomBudget = (budgetId) => {
    setSelectedCustomBudgetId(budgetId);
    setCurrentPage('custom-budget-details');
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
        {currentPage === 'budget' && (
          <BudgetPage key="budget" onNavigate={handleNavigate} />
        )}
        {currentPage === 'custom-budgets' && (
          <CustomBudgetsPage
            key="custom-budgets"
            onNavigate={handleNavigate}
            onSelectBudget={handleSelectCustomBudget}
          />
        )}
        {currentPage === 'custom-budget-details' && (
          <CustomBudgetDetailsPage
            key={`custom-budget-details-${selectedCustomBudgetId}`}
            budgetId={selectedCustomBudgetId}
            onBack={() => setCurrentPage('custom-budgets')}
            onNavigate={handleNavigate}
          />
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
    </>
  );
};

export default App;
