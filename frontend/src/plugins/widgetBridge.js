import { registerPlugin, Capacitor } from '@capacitor/core';

export const DayWiseWidget = registerPlugin('DayWiseWidget');

export async function syncAttendanceToWidget(summary, nextClass = null) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const percentage = Math.round(
      summary?.overallAttendancePercentage ?? summary?.overallPercentage ?? 0
    );
    const target = Math.round(
      summary?.targetAttendance ?? summary?.target ?? 75
    );
    const totalClasses = summary?.totalClasses ?? 0;
    const attendedClasses = summary?.totalAttendedClasses ?? summary?.attendedClasses ?? 0;
    const canBunk = summary?.canBunk ?? 0;
    const needToAttend = summary?.needToAttend ?? 0;

    let insightText = '';
    if (percentage >= target) {
      insightText = canBunk > 0 ? `You can miss ${canBunk} class${canBunk > 1 ? 'es' : ''}` : `On track with ${target}% goal`;
    } else {
      insightText = needToAttend > 0 ? `Attend ${needToAttend} class${needToAttend > 1 ? 'es' : ''} to reach ${target}%` : `Below ${target}% target`;
    }

    await DayWiseWidget.updateAttendanceWidget({
      percentage,
      target,
      totalClasses,
      attendedClasses,
      status: summary?.status || (percentage >= target ? 'On Track' : 'Shortage'),
      classesCanMiss: canBunk,
      classesRequired: needToAttend,
      insightText,
      nextClassName: nextClass?.name || 'No classes scheduled',
      nextClassTime: nextClass?.time || '',
    });
  } catch (err) {
    console.error('Failed to sync widget attendance:', err);
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

