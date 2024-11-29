package com.mobile.mezon;

import android.content.Context;
import android.os.PowerManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class WakeLockModule extends ReactContextBaseJavaModule {
    private PowerManager.WakeLock wakeLock;
    private static final String MODULE_NAME = "WakeLockModule";

    public WakeLockModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void acquireWakeLock() {
        // Release existing wake lock if any
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }

        PowerManager powerManager = (PowerManager) getReactApplicationContext()
                .getSystemService(Context.POWER_SERVICE);

        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "MyApp:WakeLockTag"
            );
            wakeLock.acquire();
        }
    }

    @ReactMethod
    public void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            android.widget.Toast.makeText(getReactApplicationContext(), "WakeLock released", android.widget.Toast.LENGTH_SHORT).show();
            wakeLock.release();
            wakeLock = null;
        }
    }
}
