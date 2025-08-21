package com.cas

import android.location.Location
import com.cas.extensions.MediationManagerWrapper
import com.cas.extensions.fromReadableMap
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

    val flow = ConsentFlow()
      .withDismissListener { status ->
        reactApplicationContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("consentFlowDismissed", status)
      }
      .withUIContext(activity)

    flow.show()
    promise.resolve(null)
  }

  @ReactMethod
  fun getSDKVersion(promise: Promise) {
    promise.resolve(CAS.getSDKVersion())
  }

  @ReactMethod
  fun getTargetingOptions(promise: Promise) {
    val to = CAS.getTargetingOptions()
    val map = WritableNativeMap()
    map.putInt("age", to.age)
    map.putInt("gender", to.gender)
    to.location?.let { map.putMap("location", it.toReadableMap()) }
    to.contentUrl?.let { map.putString("contentUrl", it) }

    val arr = WritableNativeArray()
    to.keywords?.forEach { k -> arr.pushString(k) }
    map.putArray("keywords", arr)

    promise.resolve(map)
  }

  @ReactMethod
  fun setTargetingOptions(map: ReadableMap) {
    val to = CAS.getTargetingOptions()
    if (map.hasKey("age")) to.age = map.getInt("age")
    if (map.hasKey("gender")) to.gender = map.getInt("gender")
    map.getMap("location")?.let { to.location = Location::class.fromReadableMap(it) }
    map.getString("contentUrl")?.let { to.contentUrl = it }
    map.getArray("keywords")?.let { ra ->
      val list = ra.toArrayList().filterIsInstance<String>().toSet()
      to.keywords = list
    }
  }

  @ReactMethod
  fun getSettings(promise: Promise) {
    promise.resolve(CAS.settings.toReadableMap())
  }

  @ReactMethod
  fun setSettings(settings: ReadableMap) {
    CAS.settings.fromReadableMap(settings)
  }
}
