package com.mezon.mobile;

import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.os.Build

class NotificationActionReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "NotificationReceiver"
        private const val NOTIFICATION_ID = 1001
        private const val PREF_NAME = "NotificationPrefs"
    }
    private var vibrator: Vibrator? = null

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
            }
            "NOTIFICATION_DISMISSED" -> {
                val service = context as CustomFirebaseMessagingService
                service.cancelCallTimeout()
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
}
