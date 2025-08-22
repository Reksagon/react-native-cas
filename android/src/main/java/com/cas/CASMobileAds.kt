package com.cas

import com.cas.extensions.MediationManagerWrapper
import com.cas.extensions.toReadableMap
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAds(
  context: ReactApplicationContext,
  private val managerWrapper: MediationManagerWrapper
) : ReactContextBaseJavaModule(context) {

  override fun getName() = "CASMobileAds"

  @ReactMethod
  fun initialize(params: ReadableMap, promise: Promise) {
    try {
      val activity = reactApplicationContext.currentActivity
      if (activity == null) {
        promise.reject(Error("No activity in react application context!"))
        return
      }

      val responseMap = WritableNativeMap()

      val builder = CAS.buildManager()
        .withCasId(params.getString("casId") ?: activity.packageName)
        .withCompletionListener {
          managerWrapper.manager = it.manager
          it.error?.let { err -> responseMap.putString("error", err) }
          it.countryCode?.let { cc -> responseMap.putString("countryCode", cc) }
          responseMap.putBoolean("isConsentRequired", it.isConsentRequired)
          responseMap.putInt("consentFlowStatus", 0)
          promise.resolve(responseMap)
        }

      if (params.hasKey("testMode") && params.getBoolean("testMode")) {
        builder.withTestAdMode(true)
      }

      params.getMap("mediationExtra")?.let {
        val key = it.getString("key")
        val value = it.getString("value")
        if (key != null && value != null) builder.withMediationExtras(key, value)
      }

      builder.initialize(activity.application)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun showConsentFlow(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject(Error("No activity in react application context!"))
      return
    }

    ConsentFlow()
      .withDismissListener { status ->
        reactApplicationContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("consentFlowDismissed", status)
      }
      .withUIContext(activity)
      .show()

    promise.resolve(null)
  }

  @ReactMethod
  fun getSDKVersion(promise: Promise) {
    promise.resolve(CAS.getSDKVersion())
  }

  @ReactMethod
  fun getSettings(promise: Promise) {
    promise.resolve(CAS.settings.toReadableMap())
  }

  @ReactMethod
  fun setSettings(settings: ReadableMap, promise: Promise) {
    val s = CAS.settings
    if (settings.hasKey("taggedAudience")) {
      s.taggedAudience = settings.getInt("taggedAudience")
    }
    if (settings.hasKey("debugMode")) {
      s.debugMode = settings.getBoolean("debugMode")
    }
    if (settings.hasKey("trialAdFreeInterval")) {
      s.trialAdFreeInterval = settings.getInt("trialAdFreeInterval")
    }
    if (settings.hasKey("mutedAdSounds")) {
      s.mutedAdSounds = settings.getBoolean("mutedAdSounds")
    }
    if (settings.hasKey("testDeviceIDs")) {
      val list = settings.getArray("testDeviceIDs")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
      s.testDeviceIDs = list.toSet()
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun getTargetingOptions(promise: Promise) {
    val to = CAS.getTargetingOptions()
    val map = WritableNativeMap()
    map.putInt("age", to.age)
    map.putInt("gender", to.gender)
    to.contentUrl?.let { map.putString("contentUrl", it) }
    val kw = (to.keywords ?: emptySet()).toTypedArray()
    val arr = Arguments.createArray().apply { kw.forEach { pushString(it) } }
    map.putArray("keywords", arr)
    promise.resolve(map)
  }

  @ReactMethod
  fun setTargetingOptions(options: ReadableMap, promise: Promise) {
    val to = CAS.getTargetingOptions()
    if (options.hasKey("age")) {
      to.age = options.getInt("age")
    }
    if (options.hasKey("gender")) {
      to.gender = options.getInt("gender")
    }
    if (options.hasKey("contentUrl")) {
      to.contentUrl = options.getString("contentUrl")
    }
    if (options.hasKey("keywords")) {
      val list = options.getArray("keywords")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
      to.keywords = list.toSet()
    }
    promise.resolve(null)
  }

  @ReactMethod fun addListener(eventName: String?) {}
  @ReactMethod fun removeListeners(count: Int?) {}
}
