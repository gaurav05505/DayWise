package com.daywise.app.widget

import android.content.Context
import android.content.SharedPreferences

data class AttendanceWidgetData(
    val percentage: Int,
    val target: Int,
    val totalClasses: Int,
    val attendedClasses: Int,
    val status: String,
    val classesCanMiss: Int,
    val classesRequired: Int,
    val insightText: String,
    val nextClassName: String,
    val nextClassTime: String,
    val lastUpdated: Long
)

object WidgetPrefs {
    private const val PREFS_NAME = "daywise_widget_prefs"
    private const val KEY_PERCENTAGE = "attendance_percentage"
    private const val KEY_TARGET = "attendance_target"
    private const val KEY_TOTAL_CLASSES = "total_classes"
    private const val KEY_ATTENDED_CLASSES = "attended_classes"
    private const val KEY_STATUS = "attendance_status"
    private const val KEY_CLASSES_CAN_MISS = "classes_can_miss"
    private const val KEY_CLASSES_REQUIRED = "classes_required"
    private const val KEY_INSIGHT_TEXT = "insight_text"
    private const val KEY_NEXT_CLASS_NAME = "next_class_name"
    private const val KEY_NEXT_CLASS_TIME = "next_class_time"
    private const val KEY_LAST_UPDATED = "last_updated"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun saveAttendanceData(
        context: Context,
        percentage: Int,
        target: Int,
        totalClasses: Int,
        attendedClasses: Int,
        status: String,
        classesCanMiss: Int,
        classesRequired: Int,
        insightText: String,
        nextClassName: String,
        nextClassTime: String
    ) {
        getPrefs(context).edit().apply {
            putInt(KEY_PERCENTAGE, percentage)
            putInt(KEY_TARGET, target)
            putInt(KEY_TOTAL_CLASSES, totalClasses)
            putInt(KEY_ATTENDED_CLASSES, attendedClasses)
            putString(KEY_STATUS, status)
            putInt(KEY_CLASSES_CAN_MISS, classesCanMiss)
            putInt(KEY_CLASSES_REQUIRED, classesRequired)
            putString(KEY_INSIGHT_TEXT, insightText)
            putString(KEY_NEXT_CLASS_NAME, nextClassName)
            putString(KEY_NEXT_CLASS_TIME, nextClassTime)
            putLong(KEY_LAST_UPDATED, System.currentTimeMillis())
            apply()
        }
    }

    fun getAttendanceData(context: Context): AttendanceWidgetData {
        val prefs = getPrefs(context)
        val percentage = prefs.getInt(KEY_PERCENTAGE, 0)
        val target = prefs.getInt(KEY_TARGET, 75)
        val totalClasses = prefs.getInt(KEY_TOTAL_CLASSES, 0)
        val attendedClasses = prefs.getInt(KEY_ATTENDED_CLASSES, 0)
        val status = prefs.getString(KEY_STATUS, if (percentage >= target) "On Track" else "Below Target") ?: "On Track"
        val classesCanMiss = prefs.getInt(KEY_CLASSES_CAN_MISS, 0)
        val classesRequired = prefs.getInt(KEY_CLASSES_REQUIRED, 0)
        val defaultInsight = if (percentage >= target) {
            if (classesCanMiss > 0) "You can miss $classesCanMiss classes" else "On track with target"
        } else {
            if (classesRequired > 0) "Attend $classesRequired classes to reach $target%" else "Below target attendance"
        }
        val insightText = prefs.getString(KEY_INSIGHT_TEXT, defaultInsight) ?: defaultInsight
        val nextClassName = prefs.getString(KEY_NEXT_CLASS_NAME, "No classes scheduled") ?: "No classes scheduled"
        val nextClassTime = prefs.getString(KEY_NEXT_CLASS_TIME, "") ?: ""
        val lastUpdated = prefs.getLong(KEY_LAST_UPDATED, 0L)

        return AttendanceWidgetData(
            percentage = percentage,
            target = target,
            totalClasses = totalClasses,
            attendedClasses = attendedClasses,
            status = status,
            classesCanMiss = classesCanMiss,
            classesRequired = classesRequired,
            insightText = insightText,
            nextClassName = nextClassName,
            nextClassTime = nextClassTime,
            lastUpdated = lastUpdated
        )
    }
}
