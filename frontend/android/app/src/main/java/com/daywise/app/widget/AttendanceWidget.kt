package com.daywise.app.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.LocalSize
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.LinearProgressIndicator
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.updateAll
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.daywise.app.MainActivity

class AttendanceWidget : GlanceAppWidget() {

    companion object {
        private val SMALL_SQUARE = DpSize(120.dp, 110.dp)
        private val MEDIUM_RECT = DpSize(240.dp, 110.dp)
    }

    override val sizeMode = SizeMode.Responsive(
        setOf(SMALL_SQUARE, MEDIUM_RECT)
    )

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val data = WidgetPrefs.getAttendanceData(context)
        provideContent {
            val size = LocalSize.current
            if (size.width >= 230.dp) {
                MediumAttendanceWidgetContent(data)
            } else {
                SmallAttendanceWidgetContent(data)
            }
        }
    }
}

private object WidgetColors {
    val background = ColorProvider(Color(0xFF14171F))
    val accentGreen = ColorProvider(Color(0xFF55F130))
    val accentRed = ColorProvider(Color(0xFFEF4444))
    val textPrimary = ColorProvider(Color(0xFFFFFFFF))
    val textSecondary = ColorProvider(Color(0xFF8A92A0))
    val progressTrack = ColorProvider(Color(0xFF1F2430))
    val nextTagBg = ColorProvider(Color(0xFF1F2430))
    val badgeTextDark = Color(0xFF090A0F)

    fun statusBg(isOnTrack: Boolean) = if (isOnTrack) {
        ColorProvider(Color(0x2655F130))
    } else {
        ColorProvider(Color(0x26EF4444))
    }

    fun cardSurface(isOnTrack: Boolean) = if (isOnTrack) {
        ColorProvider(Color(0xFF1C2230))
    } else {
        ColorProvider(Color(0xFF241C1F))
    }

    val timeBadgeBg = ColorProvider(Color(0x1A55F130))
}

@Composable
private fun SmallAttendanceWidgetContent(data: AttendanceWidgetData) {
    val isOnTrack = data.percentage >= data.target
    val progressFraction = if (data.totalClasses > 0) {
        (data.percentage / 100f).coerceIn(0f, 1f)
    } else 0f

    val statusColor = if (isOnTrack) WidgetColors.accentGreen else WidgetColors.accentRed

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(WidgetColors.background)
            .cornerRadius(28.dp)
            .padding(14.dp)
            .clickable(actionRunCallback<OpenAppActionCallback>())
    ) {
        Column(
            modifier = GlanceModifier.fillMaxSize()
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                    Box(
                        modifier = GlanceModifier
                            .size(20.dp)
                            .background(WidgetColors.accentGreen)
                            .cornerRadius(6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "DW",
                            style = TextStyle(
                                color = ColorProvider(WidgetColors.badgeTextDark),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.width(6.dp))
                    Text(
                        text = "DayWise",
                        style = TextStyle(
                            color = WidgetColors.textPrimary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.defaultWeight())

                Box(
                    modifier = GlanceModifier
                        .background(WidgetColors.statusBg(isOnTrack))
                        .cornerRadius(12.dp)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = if (isOnTrack) "On Track" else "Below",
                        style = TextStyle(
                            color = statusColor,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Spacer(modifier = GlanceModifier.defaultWeight())

            Column {
                Text(
                    text = "${data.percentage}%",
                    style = TextStyle(
                        color = WidgetColors.textPrimary,
                        fontSize = 34.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "Overall Attendance",
                    style = TextStyle(
                        color = WidgetColors.textSecondary,
                        fontSize = 10.sp
                    )
                )
            }

            Spacer(modifier = GlanceModifier.defaultWeight())

            Column(modifier = GlanceModifier.fillMaxWidth()) {
                LinearProgressIndicator(
                    progress = progressFraction,
                    modifier = GlanceModifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .cornerRadius(3.dp),
                    color = statusColor,
                    backgroundColor = WidgetColors.progressTrack
                )
                Spacer(modifier = GlanceModifier.height(4.dp))
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.Vertical.CenterVertically
                ) {
                    Text(
                        text = "${data.attendedClasses}/${data.totalClasses} classes",
                        style = TextStyle(
                            color = WidgetColors.textSecondary,
                            fontSize = 9.sp
                        )
                    )
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Text(
                        text = "Goal: ${data.target}%",
                        style = TextStyle(
                            color = WidgetColors.textSecondary,
                            fontSize = 9.sp
                        )
                    )
                }
            }
        }
    }
}

@Composable
private fun MediumAttendanceWidgetContent(data: AttendanceWidgetData) {
    val isOnTrack = data.percentage >= data.target
    val progressFraction = if (data.totalClasses > 0) {
        (data.percentage / 100f).coerceIn(0f, 1f)
    } else 0f

    val statusColor = if (isOnTrack) WidgetColors.accentGreen else WidgetColors.accentRed
    val diff = data.percentage - data.target
    val diffText = if (diff >= 0) "+$diff% Safe" else "$diff% Warning"

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(WidgetColors.background)
            .cornerRadius(28.dp)
            .padding(14.dp)
            .clickable(actionRunCallback<OpenAppActionCallback>())
    ) {
        Column(
            modifier = GlanceModifier.fillMaxSize()
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                    Box(
                        modifier = GlanceModifier
                            .size(22.dp)
                            .background(WidgetColors.accentGreen)
                            .cornerRadius(7.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "DW",
                            style = TextStyle(
                                color = ColorProvider(WidgetColors.badgeTextDark),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.width(7.dp))
                    Text(
                        text = "DayWise",
                        style = TextStyle(
                            color = WidgetColors.textPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = GlanceModifier.width(4.dp))
                    Text(
                        text = "· Attendance",
                        style = TextStyle(
                            color = WidgetColors.textSecondary,
                            fontSize = 11.sp
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.defaultWeight())

                Row(verticalAlignment = Alignment.Vertical.CenterVertically) {
                    Box(
                        modifier = GlanceModifier
                            .background(WidgetColors.statusBg(isOnTrack))
                            .cornerRadius(12.dp)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = if (isOnTrack) "● On Track" else "▲ Below Target",
                            style = TextStyle(
                                color = statusColor,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.width(8.dp))
                    Image(
                        provider = ImageProvider(android.R.drawable.ic_popup_sync),
                        contentDescription = "Refresh",
                        modifier = GlanceModifier
                            .size(18.dp)
                            .clickable(actionRunCallback<RefreshWidgetActionCallback>())
                    )
                }
            }

            Spacer(modifier = GlanceModifier.defaultWeight())

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Column(modifier = GlanceModifier.defaultWeight()) {
                    Row(verticalAlignment = Alignment.Vertical.Bottom) {
                        Text(
                            text = "${data.percentage}%",
                            style = TextStyle(
                                color = WidgetColors.textPrimary,
                                fontSize = 38.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Spacer(modifier = GlanceModifier.width(4.dp))
                        Text(
                            text = "/ ${data.target}%",
                            style = TextStyle(
                                color = WidgetColors.textSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Text(
                        text = "Overall Attendance",
                        style = TextStyle(
                            color = WidgetColors.textSecondary,
                            fontSize = 10.sp
                        )
                    )
                    Text(
                        text = "${data.attendedClasses} attended of ${data.totalClasses}",
                        style = TextStyle(
                            color = WidgetColors.textSecondary,
                            fontSize = 9.sp
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.width(10.dp))

                Column(modifier = GlanceModifier.defaultWeight()) {
                    Row(
                        modifier = GlanceModifier.fillMaxWidth(),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = "Target Progress",
                            style = TextStyle(
                                color = WidgetColors.textSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Text(
                            text = diffText,
                            style = TextStyle(
                                color = statusColor,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.height(3.dp))
                    LinearProgressIndicator(
                        progress = progressFraction,
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .cornerRadius(3.dp),
                        color = statusColor,
                        backgroundColor = WidgetColors.progressTrack
                    )
                    Spacer(modifier = GlanceModifier.height(5.dp))

                    Box(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .background(WidgetColors.cardSurface(isOnTrack))
                            .cornerRadius(10.dp)
                            .padding(horizontal = 7.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = data.insightText,
                            style = TextStyle(
                                color = statusColor,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            ),
                            maxLines = 2
                        )
                    }
                }
            }

            Spacer(modifier = GlanceModifier.defaultWeight())

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Row(
                    modifier = GlanceModifier.defaultWeight(),
                    verticalAlignment = Alignment.Vertical.CenterVertically
                ) {
                    Box(
                        modifier = GlanceModifier
                            .background(WidgetColors.nextTagBg)
                            .cornerRadius(4.dp)
                            .padding(horizontal = 4.dp, vertical = 1.dp)
                    ) {
                        Text(
                            text = "NEXT",
                            style = TextStyle(
                                color = WidgetColors.textSecondary,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.width(6.dp))
                    Text(
                        text = data.nextClassName,
                        style = TextStyle(
                            color = WidgetColors.textPrimary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        ),
                        maxLines = 1
                    )
                }

                if (data.nextClassTime.isNotBlank()) {
                    Box(
                        modifier = GlanceModifier
                            .background(WidgetColors.timeBadgeBg)
                            .cornerRadius(6.dp)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = data.nextClassTime,
                            style = TextStyle(
                                color = WidgetColors.accentGreen,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }
        }
    }
}

class OpenAppActionCallback : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        launchIntent?.let { context.startActivity(it) }
    }
}

class RefreshWidgetActionCallback : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        AttendanceWidget().update(context, glanceId)
    }
}
