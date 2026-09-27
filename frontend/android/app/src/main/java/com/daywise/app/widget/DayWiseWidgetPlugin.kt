package com.daywise.app.widget

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import androidx.glance.appwidget.updateAll
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@CapacitorPlugin(name = "DayWiseWidget")
class DayWiseWidgetPlugin : Plugin() {

    @PluginMethod
    fun updateAttendanceWidget(call: PluginCall) {
        val currentContext = context ?: run {
            call.reject("Context is null")
            return
        }

        val percentage = call.getInt("percentage") ?: call.getInt("attendancePercentage") ?: 0
        val target = call.getInt("target") ?: call.getInt("targetAttendance") ?: 75
        val totalClasses = call.getInt("totalClasses") ?: 0
        val attendedClasses = call.getInt("attendedClasses") ?: call.getInt("totalAttendedClasses") ?: 0
        val status = call.getString("status") ?: call.getString("attendanceStatus") ?: if (percentage >= target) "On Track" else "Below Target"
        val classesCanMiss = call.getInt("classesCanMiss") ?: call.getInt("canBunk") ?: 0
        val classesRequired = call.getInt("classesRequired") ?: call.getInt("needToAttend") ?: 0

        val defaultInsight = if (percentage >= target) {
            if (classesCanMiss > 0) "You can miss $classesCanMiss classes" else "On track with target"
        } else {
            if (classesRequired > 0) "Attend $classesRequired classes to reach $target%" else "Below target attendance"
        }
        val insightText = call.getString("insightText") ?: defaultInsight
        val nextClassName = call.getString("nextClassName") ?: "No classes scheduled"
        val nextClassTime = call.getString("nextClassTime") ?: ""

        WidgetPrefs.saveAttendanceData(
            context = currentContext,
            percentage = percentage,
            target = target,
            totalClasses = totalClasses,
            attendedClasses = attendedClasses,
            status = status,
            classesCanMiss = classesCanMiss,
            classesRequired = classesRequired,
            insightText = insightText,
            nextClassName = nextClassName,
            nextClassTime = nextClassTime
        )

        CoroutineScope(Dispatchers.Main).launch {
            try {
                AttendanceWidget().updateAll(currentContext)
            } catch (_: Exception) {
            }
        }

        val ret = JSObject()
        ret.put("success", true)
        call.resolve(ret)
    }

    @PluginMethod
    fun getAttendanceWidgetData(call: PluginCall) {
        val currentContext = context ?: run {
            call.reject("Context is null")
            return
        }

        val data = WidgetPrefs.getAttendanceData(currentContext)
        val ret = JSObject().apply {
            put("percentage", data.percentage)
            put("target", data.target)
            put("totalClasses", data.totalClasses)
            put("attendedClasses", data.attendedClasses)
            put("status", data.status)
            put("classesCanMiss", data.classesCanMiss)
            put("classesRequired", data.classesRequired)
            put("insightText", data.insightText)
            put("nextClassName", data.nextClassName)
            put("nextClassTime", data.nextClassTime)
            put("lastUpdated", data.lastUpdated)
        }
        call.resolve(ret)
    }
}
