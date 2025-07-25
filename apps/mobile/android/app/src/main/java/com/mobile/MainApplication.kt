package com.mezon.mobile

import android.content.res.Configuration
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.livekit.reactnative.LiveKitReactNative
import com.livekit.reactnative.audio.AudioType
import com.mezon.mobile.CustomImageViewPackage
import com.mezon.mobile.PiPPackage
import com.mezon.mobile.VideoThumbnailPackage;
import com.mezon.mobile.CustomAudioPackage;
import com.mezon.mobile.KeepAwakePackage;
import com.mezon.mobile.DeviceUtilsPackage;
import com.mezon.mobile.NavigationBarPackage;
import com.mezon.mobile.NotificationPreferencesPackage;
import com.mezon.mobile.CallStatePackage;
import com.mezon.mobile.AudioSessionPackage;
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;

import com.facebook.react.soloader.OpenSourceMergedSoMapping

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              add(CustomImageViewPackage())
              add(PiPPackage())
              add(VideoThumbnailPackage())
              add(CustomAudioPackage())
              add(KeepAwakePackage())
              add(DeviceUtilsPackage())
              add(NavigationBarPackage())
              add(NotificationPreferencesPackage())
              add(ReactNativeFirebaseAnalyticsPackage())
              add(AudioSessionPackage())
              add(CallStatePackage())
            }

        override fun getJSMainModuleName(): String = "src/main"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    LiveKitReactNative.setup(this, AudioType.CommunicationAudioType())
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }

  fun getReactNativeHostInstance(): ReactNativeHost {
    return reactNativeHost
  }
}
