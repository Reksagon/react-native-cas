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
import com.cleversolutions.ads.AdError
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

      val showConsent =
        options?.let { it.hasKey("showConsentFormIfRequired") && !it.isNull("showConsentFormIfRequired") && it.getBoolean("showConsentFormIfRequired") }
          ?: true
      val forceTest =
        options?.let { it.hasKey("forceTestAds") && !it.isNull("forceTestAds") && it.getBoolean("forceTestAds") }
          ?: false

      if (options?.hasKey("audience") == true && !options.isNull("audience")) {
        CAS.settings.taggedAudience = options.getInt("audience")
      }
      if (options?.hasKey("trialAdFreeInterval") == true && !options.isNull("trialAdFreeInterval")) {
        CAS.settings.trialAdFreeInterval = options.getInt("trialAdFreeInterval")
      }
      if (options?.hasKey("testDeviceIds") == true && !options.isNull("testDeviceIds")) {
        val ids = options.getArray("testDeviceIds")
          ?.toArrayList()
          ?.filterIsInstance<String>()
          ?.toSet() ?: emptySet()
        CAS.settings.testDeviceIDs = ids
      }

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

      if (options?.hasKey("mediationExtras") == true && !options.isNull("mediationExtras")) {
        val extras = options.getMap("mediationExtras")
        extras?.keySetIterator()?.let { it ->
          while (it.hasNextKey()) {
            val key = it.nextKey()
            if (!extras.isNull(key)) {
              val value = extras.getString(key) ?: ""
              if (key.isNotEmpty() && value.isNotEmpty()) {
                builder.withMediationExtras(key, value)
              }
            }
          }
        }
      }

      if (forceTest) builder.withTestAdMode(true)

      builder.build(currentActivityOrNull() ?: applicationContext())
    } catch (e: Exception) {
      promise.resolve(WritableNativeMap().apply { putString("error", e.message ?: "initialize exception") })
    }
  }

  @ReactMethod fun isInitialized(promise: Promise) {
    promise.resolve(casIdentifier != null)
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

  @ReactMethod fun setDebugLoggingEnabled(enabled: Boolean, promise: Promise) {
    CAS.settings.debugMode = enabled; promise.resolve(null)
  }
  @ReactMethod fun setAdSoundsMuted(muted: Boolean, promise: Promise) {
    CAS.settings.mutedAdSounds = muted; promise.resolve(null)
  }
  @ReactMethod fun setUserAge(age: Int, promise: Promise) {
    CAS.getTargetingOptions().age = age; promise.resolve(null)
  }
  @ReactMethod fun setUserGender(gender: Int, promise: Promise) {
    CAS.getTargetingOptions().gender = gender; promise.resolve(null)
  }
  @ReactMethod fun setAppContentUrl(contentUrl: String?, promise: Promise) {
    CAS.getTargetingOptions().contentUrl = contentUrl; promise.resolve(null)
  }
  @ReactMethod fun setAppKeywords(keywordsArray: ReadableArray, promise: Promise) {
    val keywords = keywordsArray.toArrayList().filterIsInstance<String>().toSet()
    CAS.getTargetingOptions().keywords = keywords
    promise.resolve(null)
  }
  @ReactMethod fun setLocationCollectionEnabled(enabled: Boolean, promise: Promise) {
    try {
      val f = CAS.settings::class.java.getDeclaredField("trackLocation")
      f.isAccessible = true
      f.setBoolean(CAS.settings, enabled)
    } catch (_: Throwable) { /* field may change between SDK versions */ }
    promise.resolve(null)
  }
  @ReactMethod fun setTrialAdFreeInterval(interval: Int, promise: Promise) {
    CAS.settings.trialAdFreeInterval = interval; promise.resolve(null)
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
  @ReactMethod fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) {
    rewardedAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  @ReactMethod fun destroyRewarded(promise: Promise) {
    rewardedAd?.destroy(); rewardedAd = null; createOrRecreateRewarded(); promise.resolve(null)
  }

  @ReactMethod fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpenAd?.isLoaded == true)
  }
  @ReactMethod fun loadAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(applicationContext()); promise.resolve(null)
  }
  @ReactMethod fun showAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.show(currentActivityOrNull()); promise.resolve(null)
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
