import React, { useState } from 'react';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { BudgetPage } from './pages/BudgetPage.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('attendance');

  return (
    <>
      {currentPage === 'attendance' && (
        <AttendancePage onNavigate={(page) => setCurrentPage(page)} />
      )}
      {currentPage === 'budget' && (
        <BudgetPage onNavigate={(page) => setCurrentPage(page)} />
      )}
    </>
  );
};

export default App;
