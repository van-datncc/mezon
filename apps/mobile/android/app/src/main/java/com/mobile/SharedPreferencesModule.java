// SharedPreferencesModule.java
package com.mezon.mobile;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "SharedPreferences";

    public SharedPreferencesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getItem(String key, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
            String value = sharedPreferences.getString(key, null);
            promise.resolve(value);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @ReactMethod
    public void removeItem(String key, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.remove(key);
            boolean success = editor.commit();
            if (success) {
                promise.resolve(null);
            } else {
                promise.reject("Error", "Failed to remove item");
            }
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}
