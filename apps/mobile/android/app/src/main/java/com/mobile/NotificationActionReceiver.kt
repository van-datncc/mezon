package com.mezon.mobile;

import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class NotificationActionReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "NotificationReceiver"
        private const val NOTIFICATION_ID = 1001
        private const val PREF_NAME = "NotificationPrefs"
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "Received broadcast action: ${intent.action}")

        when (intent.action) {
            "DECLINE_CALL_ACTION" -> {
                Log.d(TAG, "Decline call action received")
                // Cancel the notification
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.cancel(NOTIFICATION_ID)

                // Remove stored notification data
                removeNotificationData(context)

                // Stop vibration
                stopVibration(context)
            }
        }
    }

    private fun removeNotificationData(context: Context) {
        try {
            val sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.remove("notificationDataCalling")
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error removing notification data: ${e.message}")
        }
    }

    private fun stopVibration(context: Context) {
        try {
            val vibrator = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as android.os.VibratorManager
                vibratorManager.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as android.os.Vibrator
            }
            vibrator.cancel()
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping vibration: ${e.message}")
        }
    }
}
