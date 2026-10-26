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
import androidx.glance.LocalSize
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
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
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

class AttendanceWidget : GlanceAppWidget() {

    companion object {
        private val SMALL_BOX = DpSize(120.dp, 100.dp)
        private val MEDIUM_BOX = DpSize(220.dp, 110.dp)
        private val LARGE_BOX = DpSize(300.dp, 120.dp)
    }

    override val sizeMode = SizeMode.Responsive(
        setOf(SMALL_BOX, MEDIUM_BOX, LARGE_BOX)
    )

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val state = WidgetScheduleResolver.resolveWidgetState(context)
        provideContent {
            val size = LocalSize.current
            QuickAttendanceWidgetContent(state, isCompact = size.width < 200.dp)
        }
    }
}

private object WidgetTheme {
    val outerBackground = ColorProvider(Color(0xFF0B0C0F))
    val cardSurface = ColorProvider(Color(0xFF1D1D1D))
    val textPrimary = ColorProvider(Color(0xFFF4F5F7))
    val textSecondary = ColorProvider(Color(0xFF9A9DA8))
    val accentGreen = ColorProvider(Color(0xFF24D366))
    val accentRed = ColorProvider(Color(0xFFF04444))
    val darkBtnText = ColorProvider(Color(0xFF0B0C0F))
    val whiteBtnText = ColorProvider(Color(0xFFFFFFFF))
    val badgeBg = ColorProvider(Color(0x1AFFFFFF))
    val successBadgeBg = ColorProvider(Color(0x2624D366))
    val errorBadgeBg = ColorProvider(Color(0x26F04444))
}

@Composable
private fun QuickAttendanceWidgetContent(state: WidgetState, isCompact: Boolean) {
    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(WidgetTheme.outerBackground)
            .cornerRadius(22.dp)
            .padding(if (isCompact) 8.dp else 10.dp)
            .clickable(actionRunCallback<OpenAppActionCallback>())
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(WidgetTheme.cardSurface)
                .cornerRadius(18.dp)
                .padding(horizontal = if (isCompact) 10.dp else 14.dp, vertical = if (isCompact) 9.dp else 12.dp)
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Text(
                    text = if (state.isClassOngoing) "CURRENT CLASS" else "UPCOMING CLASS",
                    style = TextStyle(
                        color = WidgetTheme.textSecondary,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                )

                Spacer(modifier = GlanceModifier.defaultWeight())

                if (state.isClassOngoing) {
                    Box(
                        modifier = GlanceModifier
                            .background(WidgetTheme.successBadgeBg)
                            .cornerRadius(10.dp)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "LIVE",
                            style = TextStyle(
                                color = WidgetTheme.accentGreen,
                                fontSize = 8.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }

            Spacer(modifier = GlanceModifier.height(3.dp))

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Text(
                    text = state.subjectDisplayTitle,
                    style = TextStyle(
                        color = WidgetTheme.textPrimary,
                        fontSize = if (isCompact) 14.sp else 16.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    maxLines = 1,
                    modifier = GlanceModifier.defaultWeight()
                )

                if (state.percentage != null) {
                    Text(
                        text = " · ${state.percentage}%",
                        style = TextStyle(
                            color = if (state.percentage >= 75) WidgetTheme.accentGreen else WidgetTheme.accentRed,
                            fontSize = if (isCompact) 14.sp else 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Spacer(modifier = GlanceModifier.height(6.dp))

            if (state.isClassOngoing) {
                if (state.isMarked) {
                    Box(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .height(32.dp)
                            .background(if (state.markedStatus == "present") WidgetTheme.successBadgeBg else WidgetTheme.errorBadgeBg)
                            .cornerRadius(9.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (state.markedStatus == "present") "✓ Marked Present" else "✕ Marked Absent",
                            style = TextStyle(
                                color = if (state.markedStatus == "present") WidgetTheme.accentGreen else WidgetTheme.accentRed,
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                } else {
                    Row(
                        modifier = GlanceModifier.fillMaxWidth(),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .defaultWeight()
                                .height(32.dp)
                                .background(WidgetTheme.accentGreen)
                                .cornerRadius(9.dp)
                                .clickable(actionRunCallback<MarkPresentActionCallback>()),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "✓ Present",
                                style = TextStyle(
                                    color = WidgetTheme.darkBtnText,
                                    fontSize = 11.5.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }

                        Spacer(modifier = GlanceModifier.width(8.dp))

                        Box(
                            modifier = GlanceModifier
                                .defaultWeight()
                                .height(32.dp)
                                .background(WidgetTheme.accentRed)
                                .cornerRadius(9.dp)
                                .clickable(actionRunCallback<MarkAbsentActionCallback>()),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "✕ Absent",
                                style = TextStyle(
                                    color = WidgetTheme.whiteBtnText,
                                    fontSize = 11.5.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                }
            } else {
                Box(
                    modifier = GlanceModifier
                        .fillMaxWidth()
                        .height(28.dp)
                        .background(WidgetTheme.badgeBg)
                        .cornerRadius(8.dp)
                        .padding(horizontal = 8.dp),
                    contentAlignment = Alignment.CenterStart
                ) {
                    Text(
                        text = state.upcomingTimingText,
                        style = TextStyle(
                            color = WidgetTheme.accentGreen,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        ),
                        maxLines = 1
                    )
                }
            }

            Spacer(modifier = GlanceModifier.height(5.dp))

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Text(
                    text = state.nextClassRowText,
                    style = TextStyle(
                        color = WidgetTheme.textSecondary,
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Normal
                    ),
                    maxLines = 1
                )
            }
        }
    }
}

class MarkPresentActionCallback : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        WidgetScheduleResolver.markCurrentClass(context, "present")
        AttendanceWidget().update(context, glanceId)
    }
}

class MarkAbsentActionCallback : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        WidgetScheduleResolver.markCurrentClass(context, "absent")
        AttendanceWidget().update(context, glanceId)
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
