package com.mezon.mobile;

import android.content.Context
import com.facebook.react.bridge.*

class NotificationPreferencesModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val PREF_NAME = "NotificationPrefs"
    }

    override fun getName(): String {
        return "NotificationPreferences"
    }

    @ReactMethod
    fun getValue(key: String, promise: Promise) {
        try {
            val sharedPreferences = reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val value = sharedPreferences.getString(key, null)

            if (value != null) {
                promise.resolve(value)
            } else {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get value: ${e.message}")
        }
    }

    @ReactMethod
    fun getAllValues(promise: Promise) {
        try {
            val sharedPreferences = reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val allEntries = sharedPreferences.all
            val result = Arguments.createMap()

            for ((key, value) in allEntries) {
                when (value) {
                    is String -> result.putString(key, value)
                    is Long -> result.putDouble(key, value.toDouble())
                    is Int -> result.putInt(key, value)
                    is Boolean -> result.putBoolean(key, value)
                    is Float -> result.putDouble(key, value.toDouble())
                    else -> result.putString(key, value.toString())
                }
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get values: ${e.message}")
        }
    }

    @ReactMethod
    fun clearValue(key: String, promise: Promise) {
        try {
            val sharedPreferences = reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.remove(key)
            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to clear value: ${e.message}")
        }
    }

    @ReactMethod
    fun clearAll(promise: Promise) {
        try {
            val sharedPreferences = reactApplicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()
            editor.clear()
            editor.apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to clear values: ${e.message}")
        }
    }
}
