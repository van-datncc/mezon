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

    override fun onCreate() {
        super.onCreate()
        startVibration()
    }

    override fun onDestroy() {
        super.onDestroy()
        stopVibration()
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
        vibrator?.cancel()
    }

    override fun onBind(intent: android.content.Intent?) = null
}
