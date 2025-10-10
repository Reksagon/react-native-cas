package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
import com.cleveradssolutions.plugin.reactnative.extensions.optBoolean
import com.cleveradssolutions.plugin.reactnative.extensions.optIntOrNull
import com.cleveradssolutions.plugin.reactnative.extensions.optMap
import com.cleveradssolutions.plugin.reactnative.extensions.optStringList
import com.cleveradssolutions.sdk.AdFormat
import com.cleveradssolutions.sdk.base.CASHandler
import com.cleveradssolutions.sdk.screen.CASAppOpen
import com.cleveradssolutions.sdk.screen.CASInterstitial
import com.cleveradssolutions.sdk.screen.CASRewarded
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAdsModuleImpl(private val reactContext: ReactApplicationContext) {
  companion object { const val NAME = "CASMobileAds" }

  private var casIdentifier: String? = null
  private var interstitialAd: CASInterstitial? = null
  private var rewardedAd: CASRewarded? = null
  private var appOpenAd: CASAppOpen? = null

  private var interstitialCallback: ScreenContentCallback? = null
  private var rewardedCallback: ScreenContentCallback? = null
  private var appOpenCallback: ScreenContentCallback? = null

  private fun appCtx(): Context = reactContext.applicationContext
  private fun curActivity(): Activity? = reactContext.currentActivity

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
    val callback = ScreenContentCallback(reactContext, AdFormat.INTERSTITIAL.label)
    interstitialCallback = callback
    interstitialAd = CASInterstitial(appCtx(), id).apply {
      contentCallback = callback
      onImpressionListener = callback
    }
  }

  private fun createOrRecreateRewarded() {
    val id = casIdentifier ?: return
    val callback = ScreenContentCallback(reactContext, AdFormat.REWARDED.label)
    rewardedCallback = callback
    rewardedAd = CASRewarded(appCtx(), id).apply {
      contentCallback = callback
      onImpressionListener = callback
    }
  }

  private fun createOrRecreateAppOpen() {
    val id = casIdentifier ?: return
    val callback = ScreenContentCallback(reactContext, AdFormat.APP_OPEN.label)
    appOpenCallback = callback
    appOpenAd = CASAppOpen(appCtx(), id).apply {
      contentCallback = callback
      onImpressionListener = callback
    }
  }


  fun initialize(casId: String, options: ReadableMap?, promise: Promise) {
    try {
      casIdentifier = casId

      val showConsent = options.optBoolean("showConsentFormIfRequired", true)
      val forceTest = options.optBoolean("forceTestAds", false)

      options.optIntOrNull("audience")?.let { CAS.settings.taggedAudience = it }
      options.optIntOrNull("trialAdFreeInterval")?.let { CAS.settings.trialAdFreeInterval = it }
      CAS.settings.testDeviceIDs = options.optStringList("testDeviceIds").toSet()

      val consent = ConsentFlow(showConsent).apply {
        options.optIntOrNull("debugPrivacyGeography")?.let { debugGeography = it }
      }

      createOrRecreateInterstitial()
      createOrRecreateRewarded()
      createOrRecreateAppOpen()

      val builder = CAS.buildManager()
        .withCasId(casId)
        .withConsentFlow(consent)
        .withCompletionListener { initConfiguration ->
          val out = WritableNativeMap().apply {
            initConfiguration.error?.let { putString("error", it) }
            initConfiguration.countryCode?.let { putString("countryCode", it) }
            putBoolean("isConsentRequired", initConfiguration.isConsentRequired)
            putInt("consentFlowStatus", initConfiguration.consentFlowStatus)
          }
          promise.resolve(out)
        }

      options.optMap("mediationExtras")?.let { extras ->
        val it = extras.keySetIterator()
        while (it.hasNextKey()) {
          val key = it.nextKey()
          val value = if (!extras.isNull(key)) extras.getString(key) else null
          if (key.isNotEmpty() && !value.isNullOrEmpty()) {
            builder.withMediationExtras(key, value)
          }
        }
      }

      if (forceTest) builder.withTestAdMode(true)

      builder.build(curActivity() ?: appCtx())
    } catch (e: Exception) {
      promise.resolve(WritableNativeMap().apply {
        putString("error", e.message ?: "initialize exception")
      })
    }
  }

  fun isInitialized(promise: Promise) {
    promise.resolve(casIdentifier != null)
  }

  fun showConsentFlow(promise: Promise) {
    val activity = curActivity()
    CASHandler.main {
      ConsentFlow()
        .withUIContext(activity)
        .withDismissListener { status -> promise.resolve(status) }
        .showIfRequired()
    }
  }

  fun getSDKVersion(promise: Promise) {
    promise.resolve(CAS.getSDKVersion())
  }

  fun setDebugLoggingEnabled(enabled: Boolean) {
    CAS.settings.debugMode = enabled
  }

  fun setAdSoundsMuted(muted: Boolean) {
    CAS.settings.mutedAdSounds = muted
  }

  fun setUserAge(age: Int) {
    CAS.getTargetingOptions().age = age
  }

  fun setUserGender(gender: Int) {
    CAS.getTargetingOptions().gender = gender
  }

  fun setAppContentUrl(contentUrl: String?) {
    CAS.getTargetingOptions().contentUrl = contentUrl
  }

  fun setAppKeywords(keywordsArray: ReadableArray) {
    val keywords = keywordsArray.toArrayList().filterIsInstance<String>().toSet()
    CAS.getTargetingOptions().keywords = keywords
  }

  fun setLocationCollectionEnabled(enabled: Boolean) {
    try {
      val f = CAS.settings::class.java.getDeclaredField("trackLocation")
      f.isAccessible = true
      f.setBoolean(CAS.settings, enabled)
    } catch (_: Throwable) { }
  }

  fun setTrialAdFreeInterval(interval: Int) {
    CAS.settings.trialAdFreeInterval = interval
  }

  fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitialAd?.isLoaded == true)
  }

  fun loadInterstitialAd() {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialLoadFailed", AdError.NOT_INITIALIZED)
      return
    }
    ad.load(appCtx())
  }

  fun showInterstitialAd() {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialFailedToShow", AdError.NOT_INITIALIZED)
      return
    }
    ad.show(curActivity())
  }

  fun setInterstitialAutoloadEnabled(enabled: Boolean) {
    interstitialAd?.isAutoloadEnabled = enabled
  }

  fun setInterstitialAutoshowEnabled(enabled: Boolean) {
    interstitialAd?.isAutoshowEnabled = enabled
  }

  fun setInterstitialMinInterval(seconds: Int) {
    interstitialAd?.minInterval = seconds
  }

  fun restartInterstitialInterval() {
    interstitialAd?.restartInterval()
  }

  fun destroyInterstitial() {
    interstitialAd?.destroy()
    interstitialAd = null
    createOrRecreateInterstitial()
  }

  fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewardedAd?.isLoaded == true)
  }

  fun loadRewardedAd() {
    val ad = rewardedAd ?: run {
      emitError("onRewardedLoadFailed", AdError.NOT_INITIALIZED)
      return
    }
    ad.load(appCtx())
  }

  fun showRewardedAd() {
    val ad = rewardedAd ?: run {
      emitError("onRewardedFailedToShow", AdError.NOT_INITIALIZED)
      return
    }
    rewardedCallback?.let { listener -> ad.show(curActivity(), listener) }
  }

  fun setRewardedAutoloadEnabled(enabled: Boolean) {
    rewardedAd?.isAutoloadEnabled = enabled
  }

  fun destroyRewarded() {
    rewardedAd?.destroy()
    rewardedAd = null
    createOrRecreateRewarded()
  }

  fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpenAd?.isLoaded == true)
  }

  fun loadAppOpenAd() {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenLoadFailed", AdError.NOT_INITIALIZED)
      return
    }
    ad.load(appCtx())
  }

  fun showAppOpenAd() {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenFailedToShow", AdError.NOT_INITIALIZED)
      return
    }
    ad.show(curActivity())
  }

  fun setAppOpenAutoloadEnabled(enabled: Boolean) {
    appOpenAd?.isAutoloadEnabled = enabled
  }

  fun setAppOpenAutoshowEnabled(enabled: Boolean) {
    appOpenAd?.isAutoshowEnabled = enabled
  }

  fun destroyAppOpen() {
    appOpenAd?.destroy()
    appOpenAd = null
    createOrRecreateAppOpen()
  }
}
