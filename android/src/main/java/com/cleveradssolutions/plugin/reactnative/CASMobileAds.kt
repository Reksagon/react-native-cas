package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
import com.cleveradssolutions.sdk.AdErrorCode
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.cleveradssolutions.sdk.base.CASHandler
import com.cleveradssolutions.sdk.screen.CASAppOpen
import com.cleveradssolutions.sdk.screen.CASInterstitial
import com.cleveradssolutions.sdk.screen.CASRewarded
import com.cleveradssolutions.sdk.screen.OnRewardEarnedListener
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAds(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "CASMobileAds"

  private var casIdentifier: String? = null
  private var interstitialAd: CASInterstitial? = null
  private var rewardedAd: CASRewarded? = null
  private var appOpenAd: CASAppOpen? = null

  private val mediationExtras: HashMap<String, String> = HashMap()
  private var consentFlowEnabled: Boolean = true


  private fun applicationContext(): Context = reactContext.applicationContext
  private fun currentActivityOrNull(): Activity? = reactContext.currentActivity

  private fun emit(eventName: String, payload: WritableMap = WritableNativeMap()) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, payload)
  }

  private fun emitError(event: String, type: String, code: Int, message: String?) {
    emit(event, WritableNativeMap().apply {
      putString("type", type)
      putInt("errorCode", code)
      putString("errorMessage", message ?: "")
    })
  }

  private fun requireCasIdentifierOrNull(): String? = casIdentifier

  private fun interstitial(): CASInterstitial? {
    val id = requireCasIdentifierOrNull() ?: return null
    return interstitialAd ?: CASInterstitial(applicationContext(), id).also { interstitialAd = it }
  }

  private fun rewarded(): CASRewarded? {
    val id = requireCasIdentifierOrNull() ?: return null
    return rewardedAd ?: CASRewarded(applicationContext(), id).also { rewardedAd = it }
  }

  private fun appOpen(): CASAppOpen? {
    val id = requireCasIdentifierOrNull() ?: return null
    return appOpenAd ?: CASAppOpen(applicationContext(), id).also { appOpenAd = it }
  }


  @ReactMethod
  fun initialize(casId: String, testMode: Boolean, promise: Promise) {
    try {
      casIdentifier = casId

      val managerBuilder = CAS.buildManager()
        .withCasId(casId)
        .withConsentFlow(ConsentFlow(consentFlowEnabled))
        .withCompletionListener { completion ->
          val response = WritableNativeMap().apply {
            completion.error?.let { putString("error", it) }
            completion.countryCode?.let { putString("countryCode", it) }
            putBoolean("isConsentRequired", completion.isConsentRequired)
            putInt("consentFlowStatus", 0)
          }
          promise.resolve(response)
        }

      if (testMode) managerBuilder.withTestAdMode(true)

      mediationExtras.forEach { (k, v) ->
        if (k.isNotEmpty() && v.isNotEmpty()) managerBuilder.withMediationExtras(k, v)
      }

      managerBuilder.build(applicationContext())
    } catch (e: Exception) {
      val resp = WritableNativeMap().apply { putString("error", e.message ?: "initialize exception") }
      promise.resolve(resp)
    }
  }

  @ReactMethod
  fun setMediationExtras(key: String, value: String, promise: Promise) {
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
          emit("consentFlowDismissed", WritableNativeMap().apply { putInt("status", status) })
        }
        .showIfRequired()
      promise.resolve(null)
    }
  }

  @ReactMethod
  fun setConsentFlowEnabled(enabled: Boolean) {
    consentFlowEnabled = enabled
  }

  @ReactMethod
  fun getSDKVersion(promise: Promise) {
    promise.resolve(CAS.getSDKVersion())
  }

  @ReactMethod
  fun getSettings(promise: Promise) {
    try {
      val casSettings = CAS.settings
      val targetingOptions = CAS.getTargetingOptions()

      val testDeviceIdsArray = Arguments.createArray().also { array ->
        (casSettings.testDeviceIDs ?: emptySet()).forEach { deviceId ->
          array.pushString(deviceId)
        }
      }

      val keywordsArray = Arguments.createArray().also { array ->
        (targetingOptions.keywords ?: emptySet()).forEach { keyword ->
          array.pushString(keyword)
        }
      }

      val settingsMap = WritableNativeMap().apply {
        putInt("taggedAudience", casSettings.taggedAudience)
        putBoolean("debugMode", casSettings.debugMode)
        putBoolean("mutedAdSounds", casSettings.mutedAdSounds)
        putArray("testDeviceIDs", testDeviceIdsArray)
        putInt("trialAdFreeInterval", casSettings.trialAdFreeInterval)

        putInt("age", targetingOptions.age)
        putInt("gender", targetingOptions.gender)
        targetingOptions.contentUrl?.let { contentUrl ->
          putString("contentUrl", contentUrl)
        }
        putArray("keywords", keywordsArray)
      }

      promise.resolve(settingsMap)
    } catch (exception: Exception) {
      val fallbackMap = WritableNativeMap().apply {
        putInt("taggedAudience", 0)
        putBoolean("debugMode", false)
        putBoolean("mutedAdSounds", false)
        putArray("testDeviceIDs", Arguments.createArray())
        putInt("trialAdFreeInterval", 0)
        putInt("age", 0)
        putInt("gender", 0)
        putArray("keywords", Arguments.createArray())
      }
      promise.resolve(fallbackMap)
    }
  }


  @ReactMethod
  fun setSettings(map: ReadableMap, promise: Promise) {
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
    } catch (_: Exception) {
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitialAd?.isLoaded == true)
  }

  @ReactMethod
  fun loadInterstitialAd(promise: Promise) {
    val id = requireCasIdentifierOrNull()
    if (id == null) {
      emitError("adFailedToLoad", "interstitial", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    val ad = interstitial()!!

    ad.contentCallback = ScreenContentCallback(
      adType = "interstitial",
      emit = ::emit,
      onLoadResolved = { _, _ -> promise.resolve(null) }
    )
    ad.load(applicationContext())
  }

  @ReactMethod
  fun showInterstitialAd(promise: Promise) {
    val activity = currentActivityOrNull()
    val ad = interstitial()
    if (ad == null) {
      emitError("onShowFailed", "interstitial", AdErrorCode.NO_FILL, "CAS not initialized")
      promise.resolve(null); return
    }
    if (activity == null) {
      emitError("onShowFailed", "interstitial", AdErrorCode.NOT_FOREGROUND, "No current Activity")
      promise.resolve(null); return
    }
    if (!ad.isLoaded) {
      emitError("onShowFailed", "interstitial", AdErrorCode.NOT_READY, "Interstitial not loaded")
      promise.resolve(null); return
    }

    ad.contentCallback = ScreenContentCallback(
      adType = "interstitial",
      emit = ::emit,
      onShowResolved = { _, _ -> promise.resolve(null) }
    )

    CASHandler.main { ad.show(activity) }
  }

  @ReactMethod
  fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewardedAd?.isLoaded == true)
  }

  @ReactMethod
  fun loadRewardedAd(promise: Promise) {
    val id = requireCasIdentifierOrNull()
    if (id == null) {
      emitError("adFailedToLoad", "rewarded", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    val ad = rewarded()!!

    ad.contentCallback = ScreenContentCallback(
      adType = "rewarded",
      emit = ::emit,
      onLoadResolved = { _, _ -> promise.resolve(null) }
    )
    ad.load(applicationContext())
  }

  @ReactMethod
  fun showRewardedAd(promise: Promise) {
    val activity = currentActivityOrNull()
    val ad = rewarded()
    if (ad == null) {
      emitError("onShowFailed", "rewarded", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    if (activity == null) {
      emitError("onShowFailed", "rewarded", AdErrorCode.NOT_FOREGROUND, "No current Activity")
      promise.resolve(null); return
    }
    if (!ad.isLoaded) {
      emitError("onShowFailed", "rewarded", AdErrorCode.NOT_READY, "Rewarded not loaded")
      promise.resolve(null); return
    }

    ad.contentCallback = ScreenContentCallback(
      adType = "rewarded",
      emit = ::emit,
      onShowResolved = { _, _ -> promise.resolve(null) }
    )

    CASHandler.main {
      ad.show(activity, OnRewardEarnedListener {
        emit("onRewarded", WritableNativeMap().apply { putString("type", "rewarded") })
      })
    }
  }

  @ReactMethod
  fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpenAd?.isLoaded == true)
  }

  @ReactMethod
  fun loadAppOpenAd(promise: Promise) {
    val id = requireCasIdentifierOrNull()
    if (id == null) {
      emitError("adFailedToLoad", "appopen", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    val ad = appOpen()!!

    ad.contentCallback = ScreenContentCallback(
      adType = "appopen",
      emit = ::emit,
      onLoadResolved = { _, _ -> promise.resolve(null) }
    )
    ad.load(applicationContext())
  }

  @ReactMethod
  fun showAppOpenAd(promise: Promise) {
    val activity = currentActivityOrNull()
    val ad = appOpen()
    if (ad == null) {
      emitError("onShowFailed", "appopen", AdErrorCode.NOT_INITIALIZED, "CAS not initialized")
      promise.resolve(null); return
    }
    if (activity == null) {
      emitError("onShowFailed", "appopen", AdErrorCode.NOT_FOREGROUND, "No current Activity")
      promise.resolve(null); return
    }
    if (!ad.isLoaded) {
      emitError("onShowFailed", "appopen", AdErrorCode.NOT_READY, "AppOpen not loaded")
      promise.resolve(null); return
    }

    ad.contentCallback = ScreenContentCallback(
      adType = "appopen",
      emit = ::emit,
      onShowResolved = { _, _ -> promise.resolve(null) }
    )

    CASHandler.main { ad.show(activity) }
  }

  @ReactMethod fun setInterstitialAutoloadEnabled(enabled: Boolean, promise: Promise) {
    interstitial()?.let { it.isAutoloadEnabled = enabled }
    promise.resolve(null)
  }
  @ReactMethod fun setInterstitialAutoshowEnabled(enabled: Boolean, promise: Promise) {
    interstitial()?.let { it.isAutoshowEnabled = enabled }
    promise.resolve(null)
  }
  @ReactMethod fun setInterstitialMinInterval(seconds: Int, promise: Promise) {
    interstitial()?.let { it.minInterval = seconds }
    promise.resolve(null)
  }
  @ReactMethod fun restartInterstitialInterval(promise: Promise) {
    interstitial()?.restartInterval()
    promise.resolve(null)
  }
  @ReactMethod fun destroyInterstitial(promise: Promise) {
    interstitialAd?.destroy(); interstitialAd = null
    promise.resolve(null)
  }

  @ReactMethod fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) {
    rewarded()?.let { it.isAutoloadEnabled = enabled }
    promise.resolve(null)
  }
  @ReactMethod fun destroyRewarded(promise: Promise) {
    rewardedAd?.destroy(); rewardedAd = null
    promise.resolve(null)
  }

  @ReactMethod fun setAppOpenAutoloadEnabled(enabled: Boolean, promise: Promise) {
    appOpen()?.let { it.isAutoloadEnabled = enabled }
    promise.resolve(null)
  }
  @ReactMethod fun setAppOpenAutoshowEnabled(enabled: Boolean, promise: Promise) {
    appOpen()?.let { it.isAutoshowEnabled = enabled }
    promise.resolve(null)
  }
  @ReactMethod fun destroyAppOpen(promise: Promise) {
    appOpenAd?.destroy(); appOpenAd = null
    promise.resolve(null)
  }

  @ReactMethod fun addListener(eventName: String?) {}
  @ReactMethod fun removeListeners(count: Int?) {}
}
