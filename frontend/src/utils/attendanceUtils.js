export const formatTodayDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  return `${day} ${month}`;
};

export const calculatePercentage = (attended, total) => {
  if (!total || total === 0) return 0;
  return Math.round((attended / total) * 100);
};

export const getAttendanceStatus = (percentage) => {
  return percentage >= 75 ? 'On Track' : 'Below Target';
};

