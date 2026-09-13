export const formatTodayDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  return `${weekday}, ${day} ${month}`;
};

export const calculatePercentage = (attended, total) => {
  if (!total || total === 0) return 0;
  return Math.round((attended / total) * 100);
};

export const getAttendanceStatus = (percentage, target = 75) => {
  return percentage >= target ? 'On Track' : 'Below Target';
};
