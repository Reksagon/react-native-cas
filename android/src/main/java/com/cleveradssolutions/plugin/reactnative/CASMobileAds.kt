package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
import com.cleveradssolutions.sdk.AdErrorCode
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.cleveradssolutions.sdk.base.CASHandler
import com.cleveradssolutions.sdk.screen.CASAppOpen
import com.cleveradssolutions.sdk.screen.CASInterstitial
import com.cleveradssolutions.sdk.screen.CASRewarded
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAds(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "CASMobileAds"

  private var casIdentifier: String? = null

  private var interstitialAd: CASInterstitial? = null
  private var rewardedAd: CASRewarded? = null
  private var appOpenAd: CASAppOpen? = null

  private var interstitialCallback: ScreenContentCallback? = null
  private var rewardedCallback: ScreenContentCallback? = null
  private var appOpenCallback: ScreenContentCallback? = null

  private fun applicationContext(): Context = reactContext.applicationContext
  private fun currentActivityOrNull(): Activity? = reactContext.currentActivity

  private fun emitError(finalEvent: String, code: Int, message: String?) {
    val map = WritableNativeMap().apply {
      putInt("errorCode", code)
      putString("errorMessage", message ?: "")
    }
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(finalEvent, map)
  }

  private fun emitError(finalEvent: String, error: AdError) {
    val map = WritableNativeMap().apply {
      putInt("errorCode", error.code)
      putString("errorMessage", error.message)
    }
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(finalEvent, map)
  }

  private fun createOrRecreateInterstitial() {
    val id = casIdentifier ?: return
    val cb = ScreenContentCallback(reactContext, "interstitial")
    interstitialCallback = cb
    interstitialAd = CASInterstitial(applicationContext(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }
  private fun createOrRecreateRewarded() {
    val id = casIdentifier ?: return
    val cb = ScreenContentCallback(reactContext, "rewarded")
    rewardedCallback = cb
    rewardedAd = CASRewarded(applicationContext(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }
  private fun createOrRecreateAppOpen() {
    val id = casIdentifier ?: return
    val cb = ScreenContentCallback(reactContext, "appopen")
    appOpenCallback = cb
    appOpenAd = CASAppOpen(applicationContext(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }

  @ReactMethod
  fun initialize(casId: String, options: ReadableMap?, promise: Promise) {
    try {
      casIdentifier = casId

      val showConsent = if (options?.hasKey("showConsentFormIfRequired") == true && !options.isNull("showConsentFormIfRequired"))
        options.getBoolean("showConsentFormIfRequired") else true

      val forceTest = options?.hasKey("forceTestAds") == true && !options.isNull("forceTestAds") && options.getBoolean("forceTestAds")

      if (options?.hasKey("audience") == true && !options.isNull("audience")) {
        CAS.settings.taggedAudience = options.getInt("audience")
      }

      if (options?.hasKey("trialAdFreeInterval") == true && !options.isNull("trialAdFreeInterval")) {
        CAS.settings.trialAdFreeInterval = options.getInt("trialAdFreeInterval")
      }

      if (options?.hasKey("testDeviceIds") == true && !options.isNull("testDeviceIds")) {
        val ids = options.getArray("testDeviceIds")?.toArrayList()?.filterIsInstance<String>()?.toSet() ?: emptySet()
        CAS.settings.testDeviceIDs = ids
      }

  TODO("Add Mediation extras parameters")

   val mediationExtras: HashMap<String, String> = HashMap()

      val builder = CAS.buildManager()
        .withCasId(casId)
        .withConsentFlow(ConsentFlow(showConsent))
        .withCompletionListener { c ->
          createOrRecreateInterstitial()
          createOrRecreateRewarded()
          createOrRecreateAppOpen()

          val out = WritableNativeMap().apply {
            c.error?.let { putString("error", it) }
            c.countryCode?.let { putString("countryCode", it) }
            putBoolean("isConsentRequired", c.isConsentRequired)
            putInt("consentFlowStatus", 0)
          }
          promise.resolve(out)
        }



      if (forceTest) builder.withTestAdMode(true)
      mediationExtras.forEach { (k, v) -> if (k.isNotEmpty() && v.isNotEmpty()) builder.withMediationExtras(k, v) }

      builder.build(currentActivityOrNull() ?: applicationContext())
    } catch (e: Exception) {
      promise.resolve(WritableNativeMap().apply { putString("error", e.message ?: "initialize exception") })
    }
  }


  @ReactMethod fun isInitialized(promise: Promise) {
    promise.resolve(casIdentifier != null)
  }

  @ReactMethod
  fun setMediationExtras(key: String, value: String, promise: Promise) {
    TODO("Remove")
    mediationExtras[key] = value
    promise.resolve(null)
  }

  @ReactMethod
  fun showConsentFlow(promise: Promise) {
    val activity = currentActivityOrNull()
    CASHandler.main {
      ConsentFlow()
        .withUIContext(activity)
        .withDismissListener { status ->
          val map = WritableNativeMap().apply { putInt("status", status) }
          reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("consentFlowDismissed", map)
        }
        .showIfRequired()
      promise.resolve(null)
    }
  }

  @ReactMethod fun getSDKVersion(promise: Promise) { promise.resolve(CAS.getSDKVersion()) }

  @ReactMethod
  fun getSettings(promise: Promise) {
    TODO("Remove")
    try {
      val casSettings = CAS.settings
      val targetingOptions = CAS.getTargetingOptions()

      val testDeviceIds = Arguments.createArray().also { arr ->
        (casSettings.testDeviceIDs ?: emptySet()).forEach { id -> arr.pushString(id) }
      }
      val keywords = Arguments.createArray().also { arr ->
        (targetingOptions.keywords ?: emptySet()).forEach { kw -> arr.pushString(kw) }
      }

      val map = WritableNativeMap().apply {
        putInt("taggedAudience", casSettings.taggedAudience)
        putBoolean("debugMode", casSettings.debugMode)
        putBoolean("mutedAdSounds", casSettings.mutedAdSounds)
        putArray("testDeviceIDs", testDeviceIds)
        putInt("trialAdFreeInterval", casSettings.trialAdFreeInterval)

        putInt("age", targetingOptions.age)
        putInt("gender", targetingOptions.gender)
        targetingOptions.contentUrl?.let { putString("contentUrl", it) }
        putArray("keywords", keywords)
      }
      promise.resolve(map)
    } catch (_: Exception) {
      val fallback = WritableNativeMap().apply {
        putInt("taggedAudience", 0)
        putBoolean("debugMode", false)
        putBoolean("mutedAdSounds", false)
        putArray("testDeviceIDs", Arguments.createArray())
        putInt("trialAdFreeInterval", 0)
        putInt("age", 0)
        putInt("gender", 0)
        putArray("keywords", Arguments.createArray())
      }
      promise.resolve(fallback)
    }
  }

  @ReactMethod
  fun setSettings(map: ReadableMap, promise: Promise) {
    TODO("Remove")
    try {
      CAS.settings.apply {
        if (map.hasKey("taggedAudience") && !map.isNull("taggedAudience"))
          taggedAudience = map.getInt("taggedAudience")
        if (map.hasKey("debugMode") && !map.isNull("debugMode"))
          debugMode = map.getBoolean("debugMode")
        if (map.hasKey("mutedAdSounds") && !map.isNull("mutedAdSounds"))
          mutedAdSounds = map.getBoolean("mutedAdSounds")
        if (map.hasKey("testDeviceIDs") && !map.isNull("testDeviceIDs")) {
          val list = map.getArray("testDeviceIDs")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
          testDeviceIDs = list.toSet()
        }
        if (map.hasKey("trialAdFreeInterval") && !map.isNull("trialAdFreeInterval"))
          trialAdFreeInterval = map.getInt("trialAdFreeInterval")
      }

      CAS.getTargetingOptions().apply {
        if (map.hasKey("age") && !map.isNull("age")) age = map.getInt("age")
        if (map.hasKey("gender") && !map.isNull("gender")) gender = map.getInt("gender")
        if (map.hasKey("contentUrl") && !map.isNull("contentUrl")) contentUrl = map.getString("contentUrl")
        if (map.hasKey("keywords") && !map.isNull("keywords")) {
          val list = map.getArray("keywords")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
          keywords = list.toSet()
        }
      }
    } catch (_: Exception) { }
    promise.resolve(null)
  }

  @ReactMethod fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitialAd?.isLoaded == true)
  }
  @ReactMethod fun loadInterstitialAd(promise: Promise) {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(applicationContext()); promise.resolve(null)
  }
  @ReactMethod fun showInterstitialAd(promise: Promise) {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.show(currentActivityOrNull()); promise.resolve(null)
  }

  @ReactMethod fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewardedAd?.isLoaded == true)
  }
  @ReactMethod fun loadRewardedAd(promise: Promise) {
    val ad = rewardedAd ?: run {
      emitError("onRewardedLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(applicationContext()); promise.resolve(null)
  }
  @ReactMethod fun showRewardedAd(promise: Promise) {
    val ad = rewardedAd ?: run {
      emitError("onRewardedFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    rewardedCallback?.let { listener ->
      ad.show(currentActivityOrNull(), listener)
    }
    promise.resolve(null)
  }

  @ReactMethod fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpenAd?.isLoaded == true)
  }
  @ReactMethod fun loadAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenLoadFailed", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    ad.load(applicationContext()); promise.resolve(null)
  }
  @ReactMethod fun showAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenFailedToShow", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    ad.show(currentActivityOrNull()); promise.resolve(null)
  }

  @ReactMethod fun setInterstitialAutoloadEnabled(enabled: Boolean, promise: Promise) {
    interstitialAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun setInterstitialAutoshowEnabled(enabled: Boolean, promise: Promise) {
    interstitialAd?.isAutoshowEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun setInterstitialMinInterval(seconds: Int, promise: Promise) {
    interstitialAd?.minInterval = seconds; promise.resolve(null)
  }
  @ReactMethod fun restartInterstitialInterval(promise: Promise) {
    interstitialAd?.restartInterval(); promise.resolve(null)
  }
  @ReactMethod fun destroyInterstitial(promise: Promise) {
    interstitialAd?.destroy(); interstitialAd = null; createOrRecreateInterstitial(); promise.resolve(null)
  }

  @ReactMethod fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) {
    rewardedAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun destroyRewarded(promise: Promise) {
    rewardedAd?.destroy(); rewardedAd = null; createOrRecreateRewarded(); promise.resolve(null)
  }

  @ReactMethod fun setAppOpenAutoloadEnabled(enabled: Boolean, promise: Promise) {
    appOpenAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun setAppOpenAutoshowEnabled(enabled: Boolean, promise: Promise) {
    appOpenAd?.isAutoshowEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun destroyAppOpen(promise: Promise) {
    appOpenAd?.destroy(); appOpenAd = null; createOrRecreateAppOpen(); promise.resolve(null)
  }

  @ReactMethod fun addListener(eventName: String?) {}
  @ReactMethod fun removeListeners(count: Int?) {}
}
