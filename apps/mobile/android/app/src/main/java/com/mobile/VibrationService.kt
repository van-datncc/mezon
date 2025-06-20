package com.mezon.mobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import android.util.Log

class VibrationService : android.app.Service() {
    private var vibrator: Vibrator? = null
    private val CHANNEL_ID = "VibrationServiceChannel"
    private val NOTIFICATION_ID = 1113

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
        startVibration()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "You have an ongoing call"
            val descriptionText = "Ignore this notification, it will auto-hide"
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("You have an ongoing call")
            .setContentText("Ignore this notification, it will auto-hide")
            .setSmallIcon(android.R.drawable.ic_notification_overlay)
            .setPriority(NotificationCompat.VISIBILITY_SECRET)
            .setOngoing(true)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setTimeoutAfter(30000)
            .build()
    }

    override fun onDestroy() {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(NOTIFICATION_ID)
        stopVibration()
        super.onDestroy()
    }

    private fun startVibration() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibrator = vibratorManager.defaultVibrator
            } else {
                vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }

            val vibrationEffect = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // Creating a more attention-grabbing vibration pattern
                // Alternates between vibrate and pause - similar to a call
                VibrationEffect.createWaveform(
                    longArrayOf(0, 500, 500, 500, 500), // 0ms delay, 500ms ON, 500ms OFF, 500ms ON, etc.
                    intArrayOf(0, VibrationEffect.DEFAULT_AMPLITUDE, 0, VibrationEffect.DEFAULT_AMPLITUDE, 0),
                    0 // repeat from the beginning
                )
            } else {
                null
            }

            vibrator?.let {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    it.vibrate(vibrationEffect)
                } else {
                    // For older devices before API 26
                    it.vibrate(longArrayOf(0, 500, 500, 500, 500), 0)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun stopVibration() {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(NOTIFICATION_ID)
        vibrator?.cancel()
    }

    override fun onBind(intent: android.content.Intent?) = null
}
