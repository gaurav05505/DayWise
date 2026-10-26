import { registerPlugin, Capacitor } from '@capacitor/core';

export const DayWiseWidget = registerPlugin('DayWiseWidget');

export async function syncAttendanceToWidget(summary, nextClass = null, subjects = [], timetable = [], target = 75) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const percentage = Math.round(
      summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
    );
    const targetVal = Math.round(
      target || summary?.targetAttendance || summary?.target || 75
    );
    const totalClasses = summary?.totalClasses ?? 0;
    const attendedClasses = summary?.totalAttendedClasses ?? summary?.attendedClasses ?? 0;
    const canBunk = summary?.canBunk ?? 0;
    const needToAttend = summary?.needToAttend ?? 0;

    let insightText = '';
    if (percentage >= targetVal) {
      insightText = canBunk > 0 ? `You can miss ${canBunk} class${canBunk > 1 ? 'es' : ''}` : `On track with ${targetVal}% goal`;
    } else {
      insightText = needToAttend > 0 ? `Attend ${needToAttend} class${needToAttend > 1 ? 'es' : ''} to reach ${targetVal}%` : `Below ${targetVal}% target`;
    }

    const cleanSubjects = (subjects || []).map((s) => ({
      _id: s._id || s.id,
      name: s.name,
      totalClasses: s.totalClasses || 0,
      attendedClasses: s.attendedClasses || 0,
      percentage: s.percentage || 0,
      logs: s.logs || [],
      color: s.color || '#24D366',
    }));

    const cleanTimetable = (timetable || []).map((t) => ({
      _id: t._id || t.id,
      subjectName: t.subjectName,
      day: t.day,
      startTime: t.startTime,
      endTime: t.endTime,
      room: t.room || '',
      color: t.color || '#24D366',
    }));

    await DayWiseWidget.updateAttendanceWidget({
      percentage,
      target: targetVal,
      totalClasses,
      attendedClasses,
      status: summary?.status || (percentage >= targetVal ? 'On Track' : 'Shortage'),
      classesCanMiss: canBunk,
      classesRequired: needToAttend,
      insightText,
      nextClassName: nextClass?.name || 'No classes scheduled',
      nextClassTime: nextClass?.time || '',
      subjects: cleanSubjects,
      timetable: cleanTimetable,
    });
  } catch (err) {
    console.error('Failed to sync widget attendance:', err);
  }
}

export async function getPendingWidgetActions() {
  if (!Capacitor.isNativePlatform()) {
    return [];
  }
  try {
    const res = await DayWiseWidget.getPendingAttendanceActions();
    return res?.actions || [];
  } catch (err) {
    console.error('Failed to get pending widget actions:', err);
    return [];
  }
}

export async function clearPendingWidgetActions() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  try {
    await DayWiseWidget.clearPendingAttendanceActions();
  } catch (err) {
    console.error('Failed to clear pending widget actions:', err);
  }
}

export async function pinAttendanceWidgetToHomeScreen() {
  if (!Capacitor.isNativePlatform()) {
    return { supported: false, success: false };
  }

  try {
    return await DayWiseWidget.pinAttendanceWidget();
  } catch (err) {
    console.error('Failed to pin widget:', err);
    return { supported: false, success: false, error: err?.message };
  }
}
