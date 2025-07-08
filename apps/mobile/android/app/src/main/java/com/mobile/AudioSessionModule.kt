package com.mezon.mobile;

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothHeadset
import android.bluetooth.BluetoothProfile
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class AudioSessionModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val TAG = "AudioSessionModule"
    }

    private val audioManager: AudioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var bluetoothHeadset: BluetoothHeadset? = null
    private var audioReceiver: BroadcastReceiver? = null
    private var bluetoothReceiver: BroadcastReceiver? = null
    private var isBluetoothProfileInitialized: Boolean = false

    init {
        setupAudioReceiver()
        setupBluetoothReceiver()
        initializeBluetoothProfile()
    }

    override fun getName(): String = "AudioSessionModule"

    private fun setupAudioReceiver() {
        audioReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action
                Log.d(TAG, "Audio receiver action: $action")

                when (action) {
                    AudioManager.ACTION_AUDIO_BECOMING_NOISY -> {
                        // Headphones unplugged
                        Log.d(TAG, "Audio becoming noisy - headphones unplugged")
                        val currentOutput = checkCurrentAudioOutput()
                        val isBluetoothConnected = isBluetoothHeadsetConnected()
                        // Keep the logic but remove event emission
                    }
                    AudioManager.ACTION_HEADSET_PLUG -> {
                        // Headphones plugged/unplugged
                        val state = intent.getIntExtra("state", -1)
                        val isPlugged = state == 1
                        Log.d(TAG, "Headset plug state: $isPlugged")
                        val currentOutput = checkCurrentAudioOutput()
                        val isBluetoothConnected = isBluetoothHeadsetConnected()
                        // Keep the logic but remove event emission
                    }
                    AudioManager.ACTION_SCO_AUDIO_STATE_UPDATED -> {
                        // Bluetooth SCO audio state changed - THIS IS CRUCIAL FOR BLUETOOTH AUDIO
                        val state = intent.getIntExtra(AudioManager.EXTRA_SCO_AUDIO_STATE, -1)
                        Log.d(TAG, "SCO audio state changed: $state")
                        val currentOutput = checkCurrentAudioOutput()
                        val isBluetoothConnected = isBluetoothHeadsetConnected()
                        val hasHeadphones = audioManager.isWiredHeadsetOn
                        // Keep the logic but remove event emission
                    }
                }
            }
        }

        val audioFilter = IntentFilter().apply {
            addAction(AudioManager.ACTION_AUDIO_BECOMING_NOISY)
            addAction(AudioManager.ACTION_HEADSET_PLUG)
            addAction(AudioManager.ACTION_SCO_AUDIO_STATE_UPDATED) // ADDED: Critical for Bluetooth audio
        }

        reactContext.registerReceiver(audioReceiver, audioFilter)
    }

    private fun setupBluetoothReceiver() {
        bluetoothReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action

                when (action) {
                    BluetoothDevice.ACTION_ACL_CONNECTED -> {
                        val device = intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                        if (device != null && isBluetoothAudioDevice(device)) {
                            // Keep the logic but remove event emission
                        }
                    }
                    BluetoothDevice.ACTION_ACL_DISCONNECTED -> {
                        val device = intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                        if (device != null && isBluetoothAudioDevice(device)) {
                            // Keep the logic but remove event emission
                        }
                    }
                    BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED -> {
                        val state = intent.getIntExtra(BluetoothHeadset.EXTRA_STATE, -1)
                        val isConnected = state == BluetoothHeadset.STATE_CONNECTED
                        // Keep the logic but remove event emission
                    }
                }
            }
        }

        val bluetoothFilter = IntentFilter().apply {
            addAction(BluetoothDevice.ACTION_ACL_CONNECTED)
            addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED)
            addAction(BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED)
        }

        reactContext.registerReceiver(bluetoothReceiver, bluetoothFilter)
    }

    private fun isBluetoothAudioDevice(device: BluetoothDevice): Boolean {
        val bluetoothAdapter = this.bluetoothAdapter ?: return false
        val pairedDevices = bluetoothAdapter.bondedDevices

        return pairedDevices.any { pairedDevice ->
            pairedDevice == device && device.bluetoothClass.majorDeviceClass == 1024 // AUDIO_VIDEO
        }
    }

    private fun initializeBluetoothProfile() {
        bluetoothAdapter?.let { adapter ->
            try {
                val profileListener = object : BluetoothProfile.ServiceListener {
                    override fun onServiceConnected(profile: Int, proxy: BluetoothProfile) {
                        if (profile == BluetoothProfile.HEADSET) {
                            bluetoothHeadset = proxy as BluetoothHeadset
                            isBluetoothProfileInitialized = true
                            Log.d(TAG, "Bluetooth Headset profile connected")
                            
                            // Emit initial state after profile is ready
                            val currentOutput = checkCurrentAudioOutput()
                            val isBluetoothConnected = isBluetoothHeadsetConnected()
                            val hasHeadphones = audioManager.isWiredHeadsetOn
                            // Keep the logic but remove event emission
                        }
                    }

                    override fun onServiceDisconnected(profile: Int) {
                        if (profile == BluetoothProfile.HEADSET) {
                            bluetoothHeadset = null
                            isBluetoothProfileInitialized = false
                            Log.d(TAG, "Bluetooth Headset profile disconnected")
                        }
                    }
                }
                
                adapter.getProfileProxy(reactContext, profileListener, BluetoothProfile.HEADSET)
            } catch (e: Exception) {
                Log.e(TAG, "Error initializing Bluetooth profile", e)
            }
        }
    }

    @ReactMethod
    fun startAudioSession(promise: Promise) {
        try {
            Log.d(TAG, "Starting audio session")
            
            // Initialize audio session
            audioManager.mode = AudioManager.MODE_IN_COMMUNICATION
            audioManager.isSpeakerphoneOn = false

            // Get initial state and emit event
            val currentOutput = checkCurrentAudioOutput()
            val isBluetoothConnected = isBluetoothHeadsetConnected()
            val hasHeadphones = audioManager.isWiredHeadsetOn
            
            Log.d(TAG, "Initial audio state - Output: $currentOutput, Bluetooth: $isBluetoothConnected, Headphones: $hasHeadphones")
            // Keep the logic but remove event emission

            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start audio session", e)
            promise.reject("AUDIO_SESSION_ERROR", "Failed to start audio session", e)
        }
    }

    @ReactMethod
    fun stopAudioSession(promise: Promise) {
        try {
            Log.d(TAG, "Stopping audio session")
            
            audioManager.mode = AudioManager.MODE_NORMAL
            audioManager.stopBluetoothSco()

            try {
                audioReceiver?.let { reactContext.unregisterReceiver(it) }
                bluetoothReceiver?.let { reactContext.unregisterReceiver(it) }
                
                // Close Bluetooth profile proxy
                bluetoothHeadset?.let { headset ->
                    bluetoothAdapter?.closeProfileProxy(BluetoothProfile.HEADSET, headset)
                }
            } catch (e: Exception) {
                Log.w(TAG, "Error during receiver cleanup", e)
            }

            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to stop audio session", e)
            promise.reject("AUDIO_SESSION_ERROR", "Failed to stop audio session", e)
        }
    }

    @ReactMethod
    fun getCurrentAudioOutput(promise: Promise) {
        try {
            val currentOutput = checkCurrentAudioOutput()
            promise.resolve(currentOutput)
        } catch (e: Exception) {
            promise.reject("AUDIO_OUTPUT_ERROR", "Failed to get current audio output", e)
        }
    }

    @ReactMethod
    fun isBluetoothConnected(promise: Promise) {
        try {
            val isConnected = isBluetoothHeadsetConnected()
            Log.d(TAG, "Bluetooth headset connected: $isConnected")
            promise.resolve(isConnected)
        } catch (e: Exception) {
            promise.reject("BLUETOOTH_CHECK_ERROR", "Failed to check Bluetooth connection", e)
        }
    }

    @ReactMethod
    fun setAudioDevice(deviceType: String, promise: Promise) {
        try {
            Log.d(TAG, "Setting audio device to: $deviceType")

            when (deviceType.lowercase()) {
                "speaker" -> {
                    audioManager.isSpeakerphoneOn = true
                    audioManager.isBluetoothScoOn = false
                    Log.d(TAG, "Audio route set to speaker")
                }
                "earpiece" -> {
                    audioManager.isSpeakerphoneOn = false
                    audioManager.isBluetoothScoOn = false
                    Log.d(TAG, "Audio route set to earpiece")
                }
                "headphones", "wired_headset" -> {
                    audioManager.isSpeakerphoneOn = false
                    audioManager.isBluetoothScoOn = false
                    Log.d(TAG, "Audio route set to headphones/wired headset")
                }
                "bluetooth" -> {
                    audioManager.isSpeakerphoneOn = false
                    audioManager.isBluetoothScoOn = true
                    audioManager.startBluetoothSco()
                    Log.d(TAG, "Audio route set to bluetooth")
                }
                else -> {
                    Log.e(TAG, "Invalid audio device type: $deviceType")
                    promise.reject("INVALID_DEVICE", "Invalid audio device type: $deviceType")
                    return
                }
            }

            // Emit event after successful change
            val currentOutput = checkCurrentAudioOutput()
            val isBluetoothConnected = isBluetoothHeadsetConnected()
            val hasHeadphones = audioManager.isWiredHeadsetOn
            // Keep the logic but remove event emission

            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error setting audio device", e)
            promise.reject("AUDIO_DEVICE_ERROR", "Failed to set audio device", e)
        }
    }

    private fun checkCurrentAudioOutput(): String {
        // First check if Bluetooth is actually connected and active
        val isBluetoothConnected = isBluetoothHeadsetConnected()

        return when {
            isBluetoothConnected && audioManager.isBluetoothScoOn -> "bluetooth"
            audioManager.isWiredHeadsetOn -> "headphones"
            audioManager.isSpeakerphoneOn -> "speaker"
            else -> "earpiece"
        }
    }

    private fun isBluetoothHeadsetConnected(): Boolean {
        return try {
            val bluetoothAdapter = this.bluetoothAdapter ?: return false

            // Check if Bluetooth is enabled
            if (!bluetoothAdapter.isEnabled) {
                return false
            }

            // Check if any paired audio devices are connected
            val pairedDevices = bluetoothAdapter.bondedDevices
            pairedDevices.any { device ->
                // Check if the device is an audio device and connected
                isBluetoothAudioDevice(device) &&
                device.isConnected() // This requires API level check
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error checking Bluetooth headset connection", e)
            false
        }
    }

    // Helper method to check if device is connected (with API level handling)
    private fun BluetoothDevice.isConnected(): Boolean {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                // Use reflection to access the hidden isConnected method
                val method = this.javaClass.getMethod("isConnected")
                method.invoke(this) as Boolean
            } else {
                // For older versions, assume connected if bonded
                bondState == BluetoothDevice.BOND_BONDED
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error checking device connection status", e)
            false
        }
    }

    private fun getDeviceTypeString(deviceType: Int): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            when (deviceType) {
                AudioDeviceInfo.TYPE_BUILTIN_EARPIECE -> "earpiece"
                AudioDeviceInfo.TYPE_BUILTIN_SPEAKER -> "speaker"
                AudioDeviceInfo.TYPE_WIRED_HEADSET -> "wired_headset"
                AudioDeviceInfo.TYPE_WIRED_HEADPHONES -> "headphones"
                AudioDeviceInfo.TYPE_BLUETOOTH_SCO -> "bluetooth"
                AudioDeviceInfo.TYPE_BLUETOOTH_A2DP -> "bluetooth"
                else -> "unknown"
            }
        } else {
            "unknown"
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            audioReceiver?.let { reactContext.unregisterReceiver(it) }
            bluetoothReceiver?.let { reactContext.unregisterReceiver(it) }
            
            // Close Bluetooth profile proxy
            bluetoothHeadset?.let { headset ->
                bluetoothAdapter?.closeProfileProxy(BluetoothProfile.HEADSET, headset)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error during cleanup", e)
        }
    }
}
