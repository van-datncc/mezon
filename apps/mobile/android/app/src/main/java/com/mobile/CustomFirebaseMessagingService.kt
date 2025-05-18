package com.mezon.mobile;

import android.util.Log
import com.google.firebase.messaging.RemoteMessage
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService
import android.content.Context
import org.json.JSONObject

class CustomFirebaseMessagingService : ReactNativeFirebaseMessagingService() {

    companion object {
        private const val TAG = "CustomFCMService"
        private const val PREF_NAME = "NotificationPrefs"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        Log.d(TAG, "Received FCM message from: ${remoteMessage.from}")

        // Extract data from the notification
        val data = remoteMessage.data
        if (data.isNotEmpty()) {
            val offer = data["offer"]
            Log.d(TAG, "Notification data onMessageReceived: $data")
            Log.d(TAG, "Notification data OFFER onMessageReceived: $offer")
            if (offer != null) {
                if (offer == "{\"offer\":\"CANCEL_CALL\"}") {
                    removeNotificationData()
                } else {
                    saveNotificationData(data)
                }
            }
        }
    }

    private fun saveNotificationData(data: Map<String, String>) {
        try {
            Log.d(TAG, "saveNotificationData")
            val sharedPreferences = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.putString("notificationDataCalling", JSONObject(data).toString())
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error saving notification data: ${e.message}")
        }
    }

    private fun removeNotificationData() {
        try {
            val sharedPreferences = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.remove("notificationDataCalling")
            editor.apply()
        } catch (e: Exception) {
            Log.e(TAG, "Error saving notification data: ${e.message}")
        }
    }
}
