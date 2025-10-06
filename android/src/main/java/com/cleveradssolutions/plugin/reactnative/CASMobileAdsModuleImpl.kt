package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
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
    val cb = ScreenContentCallback(reactContext, "interstitial")
    interstitialCallback = cb
    interstitialAd = CASInterstitial(appCtx(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }

  private fun createOrRecreateRewarded() {
    val id = casIdentifier ?: return
    val cb = ScreenContentCallback(reactContext, "rewarded")
    rewardedCallback = cb
    rewardedAd = CASRewarded(appCtx(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }

  private fun createOrRecreateAppOpen() {
    val id = casIdentifier ?: return
    val cb = ScreenContentCallback(reactContext, "appopen")
    appOpenCallback = cb
    appOpenAd = CASAppOpen(appCtx(), id).apply {
      contentCallback = cb
      onImpressionListener = cb
    }
  }

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

      val consent = ConsentFlow(showConsent).apply {
        if (options?.hasKey("debugPrivacyGeography") == true && !options.isNull("debugPrivacyGeography")) {
          val geo = options.getInt("debugPrivacyGeography")
          debugGeography = geo
        }
      }

      createOrRecreateInterstitial()
      createOrRecreateRewarded()
      createOrRecreateAppOpen()

      val builder = CAS.buildManager()
        .withCasId(casId)
        .withConsentFlow(consent)
        .withCompletionListener { c ->
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

      builder.build(curActivity() ?: appCtx())
    } catch (e: Exception) {
      promise.resolve(WritableNativeMap().apply { putString("error", e.message ?: "initialize exception") })
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
        .withDismissListener { status ->
          promise.resolve(status)
        }
        .showIfRequired()
    }
  }

  fun getSDKVersion(promise: Promise) { promise.resolve(CAS.getSDKVersion()) }

  fun setDebugLoggingEnabled(enabled: Boolean, promise: Promise) {
    CAS.settings.debugMode = enabled; promise.resolve(null)
  }
  fun setAdSoundsMuted(muted: Boolean, promise: Promise) {
    CAS.settings.mutedAdSounds = muted; promise.resolve(null)
  }
  fun setUserAge(age: Int, promise: Promise) {
    CAS.getTargetingOptions().age = age; promise.resolve(null)
  }
  fun setUserGender(gender: Int, promise: Promise) {
    CAS.getTargetingOptions().gender = gender; promise.resolve(null)
  }
  fun setAppContentUrl(contentUrl: String?, promise: Promise) {
    CAS.getTargetingOptions().contentUrl = contentUrl; promise.resolve(null)
  }
  fun setAppKeywords(keywordsArray: ReadableArray, promise: Promise) {
    val keywords = keywordsArray.toArrayList().filterIsInstance<String>().toSet()
    CAS.getTargetingOptions().keywords = keywords
    promise.resolve(null)
  }
  fun setLocationCollectionEnabled(enabled: Boolean, promise: Promise) {
    try {
      val f = CAS.settings::class.java.getDeclaredField("trackLocation")
      f.isAccessible = true
      f.setBoolean(CAS.settings, enabled)
    } catch (_: Throwable) {  }
    promise.resolve(null)
  }
  fun setTrialAdFreeInterval(interval: Int, promise: Promise) {
    CAS.settings.trialAdFreeInterval = interval; promise.resolve(null)
  }

  fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitialAd?.isLoaded == true)
  }
  fun loadInterstitialAd(promise: Promise) {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(appCtx()); promise.resolve(null)
  }
  fun showInterstitialAd(promise: Promise) {
    val ad = interstitialAd ?: run {
      emitError("onInterstitialFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.show(curActivity()); promise.resolve(null)
  }
  fun setInterstitialAutoloadEnabled(enabled: Boolean, promise: Promise) {
    interstitialAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  fun setInterstitialAutoshowEnabled(enabled: Boolean, promise: Promise) {
    interstitialAd?.isAutoshowEnabled = enabled; promise.resolve(null)
  }
  fun setInterstitialMinInterval(seconds: Int, promise: Promise) {
    interstitialAd?.minInterval = seconds; promise.resolve(null)
  }
  fun restartInterstitialInterval(promise: Promise) {
    interstitialAd?.restartInterval(); promise.resolve(null)
  }
  fun destroyInterstitial(promise: Promise) {
    interstitialAd?.destroy(); interstitialAd = null; createOrRecreateInterstitial(); promise.resolve(null)
  }

  fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewardedAd?.isLoaded == true)
  }
  fun loadRewardedAd(promise: Promise) {
    val ad = rewardedAd ?: run {
      emitError("onRewardedLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(appCtx()); promise.resolve(null)
  }
  fun showRewardedAd(promise: Promise) {
    val ad = rewardedAd ?: run {
      emitError("onRewardedFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    rewardedCallback?.let { listener ->
      ad.show(curActivity(), listener)
    }
    promise.resolve(null)
  }
  fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) {
    rewardedAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  fun destroyRewarded(promise: Promise) {
    rewardedAd?.destroy(); rewardedAd = null; createOrRecreateRewarded(); promise.resolve(null)
  }

  fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpenAd?.isLoaded == true)
  }
  fun loadAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenLoadFailed", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.load(appCtx()); promise.resolve(null)
  }
  fun showAppOpenAd(promise: Promise) {
    val ad = appOpenAd ?: run {
      emitError("onAppOpenFailedToShow", AdError.NOT_INITIALIZED)
      promise.resolve(null); return
    }
    ad.show(curActivity()); promise.resolve(null)
  }
  fun setAppOpenAutoloadEnabled(enabled: Boolean, promise: Promise) {
    appOpenAd?.isAutoloadEnabled = enabled; promise.resolve(null)
  }
  fun setAppOpenAutoshowEnabled(enabled: Boolean, promise: Promise) {
    appOpenAd?.isAutoshowEnabled = enabled; promise.resolve(null)
  }
  fun destroyAppOpen(promise: Promise) {
    appOpenAd?.destroy(); appOpenAd = null; createOrRecreateAppOpen(); promise.resolve(null)
  }
}
