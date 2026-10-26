package com.daywise.app.widget

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.UUID

data class ClassItem(
    val id: String,
    val subjectName: String,
    val day: String,
    val startTime: String,
    val endTime: String,
    val room: String,
    val startMinutes: Int,
    val endMinutes: Int
)

data class SubjectItem(
    val id: String,
    val name: String,
    var totalClasses: Int,
    var attendedClasses: Int,
    var percentage: Int,
    val logs: JSONArray
)

data class WidgetState(
    val isClassOngoing: Boolean,
    val subjectDisplayTitle: String,
    val percentage: Int?,
    val isMarked: Boolean,
    val markedStatus: String?,
    val currentClassId: String?,
    val nextClassRowText: String,
    val upcomingTimingText: String
)

object WidgetScheduleResolver {

    private val DAY_NAMES = arrayOf(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    )

    fun timeToMinutes(timeStr: String?): Int {
        if (timeStr.isNullOrBlank() || !timeStr.contains(":")) return 0
        val parts = timeStr.trim().split(":")
        val h = parts[0].toIntOrNull() ?: 0
        val m = if (parts.size > 1) parts[1].toIntOrNull() ?: 0 else 0
        return h * 60 + m
    }

    fun formatTime12h(time24: String?): String {
        if (time24.isNullOrBlank() || !time24.contains(":")) return time24 ?: ""
        val parts = time24.trim().split(":")
        var h = parts[0].toIntOrNull() ?: return time24
        val m = if (parts.size > 1) parts[1].padStart(2, '0') else "00"
        val ampm = if (h >= 12) "PM" else "AM"
        h = h % 12
        if (h == 0) h = 12
        return "$h:$m $ampm"
    }

    fun getTodayDayName(): String {
        val calendar = Calendar.getInstance()
        val dayIndex = calendar.get(Calendar.DAY_OF_WEEK) - 1
        return DAY_NAMES[dayIndex.coerceIn(0, 6)]
    }

    fun getTodayDateKey(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    }

    fun getTodayFormattedDate(): String {
        return SimpleDateFormat("d MMM yyyy", Locale.US).format(Date())
    }

    fun parseTimetable(jsonStr: String): List<ClassItem> {
        val list = mutableListOf<ClassItem>()
        if (jsonStr.isBlank()) return list
        try {
            val array = JSONArray(jsonStr)
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                val id = obj.optString("_id", obj.optString("id", UUID.randomUUID().toString()))
                val subjectName = obj.optString("subjectName", "").trim()
                val day = obj.optString("day", "").trim()
                val startTime = obj.optString("startTime", "09:00").trim()
                val endTime = obj.optString("endTime", "10:00").trim()
                val room = obj.optString("room", "").trim()

                if (subjectName.isNotBlank() && day.isNotBlank()) {
                    list.add(
                        ClassItem(
                            id = id,
                            subjectName = subjectName,
                            day = day,
                            startTime = startTime,
                            endTime = endTime,
                            room = room,
                            startMinutes = timeToMinutes(startTime),
                            endMinutes = timeToMinutes(endTime)
                        )
                    )
                }
            }
        } catch (_: Exception) {}
        return list
    }

    fun parseSubjects(jsonStr: String): List<SubjectItem> {
        val list = mutableListOf<SubjectItem>()
        if (jsonStr.isBlank()) return list
        try {
            val array = JSONArray(jsonStr)
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                val id = obj.optString("_id", obj.optString("id", UUID.randomUUID().toString()))
                val name = obj.optString("name", "").trim()
                val total = obj.optInt("totalClasses", 0)
                val attended = obj.optInt("attendedClasses", 0)
                val pct = if (total > 0) Math.round((attended * 100f) / total) else 0
                val logs = obj.optJSONArray("logs") ?: JSONArray()

                if (name.isNotBlank()) {
                    list.add(
                        SubjectItem(
                            id = id,
                            name = name,
                            totalClasses = total,
                            attendedClasses = attended,
                            percentage = pct,
                            logs = logs
                        )
                    )
                }
            }
        } catch (_: Exception) {}
        return list
    }

    fun resolveWidgetState(context: Context): WidgetState {
        val timetableJson = WidgetPrefs.getTimetableJson(context)
        val subjectsJson = WidgetPrefs.getSubjectsJson(context)
        val pendingLogs = WidgetPrefs.getPendingAttendanceActions(context)

        val allClasses = parseTimetable(timetableJson)
        val allSubjects = parseSubjects(subjectsJson)

        val calendar = Calendar.getInstance()
        val currentDayName = getTodayDayName()
        val todayDateKey = getTodayDateKey()
        val nowMinutes = calendar.get(Calendar.HOUR_OF_DAY) * 60 + calendar.get(Calendar.MINUTE)

        val todayClasses = allClasses
            .filter { it.day.equals(currentDayName, ignoreCase = true) }
            .sortedBy { it.startMinutes }

        val currentClass = todayClasses.firstOrNull {
            nowMinutes >= it.startMinutes && nowMinutes < it.endMinutes
        }

        var nextClass: ClassItem? = null
        var nextClassDayLabel = ""

        val laterToday = todayClasses.firstOrNull { it.startMinutes > nowMinutes }
        if (laterToday != null) {
            nextClass = laterToday
            nextClassDayLabel = "Today"
        } else {
            val currentDayIndex = calendar.get(Calendar.DAY_OF_WEEK) - 1
            for (offset in 1..6) {
                val targetDayIndex = (currentDayIndex + offset) % 7
                val targetDayName = DAY_NAMES[targetDayIndex]
                val futureDayClasses = allClasses
                    .filter { it.day.equals(targetDayName, ignoreCase = true) }
                    .sortedBy { it.startMinutes }

                if (futureDayClasses.isNotEmpty()) {
                    nextClass = futureDayClasses.first()
                    nextClassDayLabel = if (offset == 1) "Tomorrow" else targetDayName.substring(0, 3)
                    break
                }
            }
        }

        val nextClassRowText = if (nextClass != null) {
            val timeFormatted = formatTime12h(nextClass.startTime)
            if (nextClassDayLabel == "Today" || nextClassDayLabel.isBlank()) {
                "Next: ${nextClass.subjectName} · $timeFormatted"
            } else {
                "Next: ${nextClass.subjectName} · $nextClassDayLabel $timeFormatted"
            }
        } else if (allClasses.isEmpty()) {
            "No timetable scheduled"
        } else {
            "No upcoming class"
        }

        if (currentClass != null) {
            val matchedSubject = allSubjects.firstOrNull {
                it.name.equals(currentClass.subjectName, ignoreCase = true)
            }
            val percentage = matchedSubject?.percentage ?: 0

            var isMarked = false
            var markedStatus: String? = null

            if (matchedSubject != null) {
                val logs = matchedSubject.logs
                for (i in 0 until logs.length()) {
                    val log = logs.optJSONObject(i) ?: continue
                    val logClassId = log.optString("timetableClassId", "")
                    val logDateKey = log.optString("dateKey", log.optString("date", ""))
                    if ((logClassId == currentClass.id || logClassId.isBlank()) && logDateKey == todayDateKey) {
                        isMarked = true
                        markedStatus = log.optString("status", "present")
                        break
                    }
                }
            }

            if (!isMarked) {
                for (i in 0 until pendingLogs.length()) {
                    val p = pendingLogs.optJSONObject(i) ?: continue
                    val pClassId = p.optString("timetableClassId", "")
                    val pDateKey = p.optString("dateKey", "")
                    if (pClassId == currentClass.id && pDateKey == todayDateKey) {
                        isMarked = true
                        markedStatus = p.optString("status", "present")
                        break
                    }
                }
            }

            scheduleNextAlarm(context, currentClass.endMinutes)

            return WidgetState(
                isClassOngoing = true,
                subjectDisplayTitle = currentClass.subjectName,
                percentage = percentage,
                isMarked = isMarked,
                markedStatus = markedStatus,
                currentClassId = currentClass.id,
                nextClassRowText = nextClassRowText,
                upcomingTimingText = "Ends ${formatTime12h(currentClass.endTime)}"
            )
        }

        if (nextClass != null) {
            val matchedSubject = allSubjects.firstOrNull {
                it.name.equals(nextClass.subjectName, ignoreCase = true)
            }
            val percentage = matchedSubject?.percentage

            val timingText = if (nextClassDayLabel == "Today" || nextClassDayLabel.isBlank()) {
                "Starts at ${formatTime12h(nextClass.startTime)}"
            } else {
                "Starts $nextClassDayLabel at ${formatTime12h(nextClass.startTime)}"
            }

            if (nextClassDayLabel == "Today") {
                scheduleNextAlarm(context, nextClass.startMinutes)
            }

            return WidgetState(
                isClassOngoing = false,
                subjectDisplayTitle = nextClass.subjectName,
                percentage = percentage,
                isMarked = false,
                markedStatus = null,
                currentClassId = null,
                nextClassRowText = nextClassRowText,
                upcomingTimingText = timingText
            )
        }

        return WidgetState(
            isClassOngoing = false,
            subjectDisplayTitle = "You are free now",
            percentage = null,
            isMarked = false,
            markedStatus = null,
            currentClassId = null,
            nextClassRowText = nextClassRowText,
            upcomingTimingText = "No running class"
        )
    }

    fun markCurrentClass(context: Context, status: String): Boolean {
        val currentState = resolveWidgetState(context)
        if (!currentState.isClassOngoing || currentState.currentClassId == null) {
            return false
        }
        if (currentState.isMarked) {
            return false
        }

        val subjectName = currentState.subjectDisplayTitle
        val todayDateKey = getTodayDateKey()
        val todayDateFormatted = getTodayFormattedDate()

        val subjectsJson = WidgetPrefs.getSubjectsJson(context)
        var subjectsArray = try {
            JSONArray(subjectsJson)
        } catch (_: Exception) {
            JSONArray()
        }

        var targetSubject: JSONObject? = null
        var targetIndex = -1

        for (i in 0 until subjectsArray.length()) {
            val obj = subjectsArray.optJSONObject(i) ?: continue
            val name = obj.optString("name", "").trim()
            if (name.equals(subjectName, ignoreCase = true)) {
                targetSubject = obj
                targetIndex = i
                break
            }
        }

        val logId = UUID.randomUUID().toString()
        val newLog = JSONObject().apply {
            put("_id", logId)
            put("timetableClassId", currentState.currentClassId)
            put("dateKey", todayDateKey)
            put("date", todayDateFormatted)
            put("status", status)
            put("timestamp", System.currentTimeMillis())
        }

        var subjectId = UUID.randomUUID().toString()

        if (targetSubject != null) {
            subjectId = targetSubject.optString("_id", targetSubject.optString("id", subjectId))
            var total = targetSubject.optInt("totalClasses", 0) + 1
            var attended = targetSubject.optInt("attendedClasses", 0)
            if (status == "present") {
                attended += 1
            }
            val pct = if (total > 0) Math.round((attended * 100f) / total) else 0

            targetSubject.put("totalClasses", total)
            targetSubject.put("attendedClasses", attended)
            targetSubject.put("percentage", pct)

            val logs = targetSubject.optJSONArray("logs") ?: JSONArray()
            logs.put(newLog)
            targetSubject.put("logs", logs)

            subjectsArray.put(targetIndex, targetSubject)
        } else {
            targetSubject = JSONObject().apply {
                put("_id", subjectId)
                put("name", subjectName)
                put("totalClasses", 1)
                put("attendedClasses", if (status == "present") 1 else 0)
                put("percentage", if (status == "present") 100 else 0)
                val logs = JSONArray()
                logs.put(newLog)
                put("logs", logs)
            }
            subjectsArray.put(targetSubject)
        }

        WidgetPrefs.saveSubjectsJson(context, subjectsArray.toString())

        val pendingAction = JSONObject().apply {
            put("subjectId", subjectId)
            put("subjectName", subjectName)
            put("timetableClassId", currentState.currentClassId)
            put("dateKey", todayDateKey)
            put("date", todayDateFormatted)
            put("status", status)
            put("timestamp", System.currentTimeMillis())
        }
        WidgetPrefs.appendPendingAttendanceAction(context, pendingAction)

        return true
    }

    private fun scheduleNextAlarm(context: Context, targetMinutes: Int) {
        try {
            val calendar = Calendar.getInstance()
            val nowMinutes = calendar.get(Calendar.HOUR_OF_DAY) * 60 + calendar.get(Calendar.MINUTE)
            val diff = targetMinutes - nowMinutes
            if (diff <= 0) return

            val triggerCal = Calendar.getInstance().apply {
                add(Calendar.MINUTE, diff)
                set(Calendar.SECOND, 2)
            }

            val intent = Intent(context, AttendanceWidgetReceiver::class.java).apply {
                action = "com.daywise.app.widget.ACTION_UPDATE_WIDGET"
            }
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                2026,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            alarmManager?.set(
                AlarmManager.RTC,
                triggerCal.timeInMillis,
                pendingIntent
            )
        } catch (_: Exception) {}
    }
}

