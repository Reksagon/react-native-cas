package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
import com.cleveradssolutions.plugin.reactnative.extensions.fromReadableMap
import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.AdFormat
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.cleveradssolutions.sdk.screen.CASAppOpen
import com.cleveradssolutions.sdk.screen.CASInterstitial
import com.cleveradssolutions.sdk.screen.CASRewarded
import com.cleveradssolutions.sdk.screen.OnRewardEarnedListener
import com.cleveradssolutions.sdk.screen.ScreenAdContentCallback
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAds(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {

  override fun getName() = "CASMobileAds"

  private var casId: String? = null
  private var interstitial: CASInterstitial? = null
  private var rewarded: CASRewarded? = null
  private var appOpen: CASAppOpen? = null

  private fun appContext(): Context = ctx.applicationContext

  private fun currentActivityOrReject(p: Promise): Activity? {
    val a = ctx.currentActivity
    if (a == null) p.reject(IllegalStateException("No current Activity"))
    return a
  }

  private fun emit(name: String, map: WritableMap = WritableNativeMap()) {
    ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(name, map)
  }

  private fun requireCasId(p: Promise): String? {
    val id = casId
    if (id == null) p.reject(IllegalStateException("CAS not initialized"))
    return id
  }

  @ReactMethod
  fun initialize(params: ReadableMap, promise: Promise) {
    try {
      val activity = currentActivityOrReject(promise) ?: return
      val resp = WritableNativeMap()
      val id = params.getString("casId") ?: activity.packageName
      casId = id

      val builder = CAS.buildManager()
        .withCasId(id)
        .withCompletionListener {
          it.error?.let { err -> resp.putString("error", err) }
          it.countryCode?.let { cc -> resp.putString("countryCode", cc) }
          resp.putBoolean("isConsentRequired", it.isConsentRequired)
          resp.putInt("consentFlowStatus", 0)
          interstitial = CASInterstitial(appContext(), id)
          rewarded = CASRewarded(appContext(), id)
          appOpen = CASAppOpen(appContext(), id)
          promise.resolve(resp)
        }

      if (params.hasKey("testMode") && !params.isNull("testMode") && params.getBoolean("testMode")) {
        builder.withTestAdMode(true)
      }

      params.getMap("mediationExtra")?.let {
        val k = it.getString("key")
        val v = it.getString("value")
        if (!k.isNullOrEmpty() && !v.isNullOrEmpty()) builder.withMediationExtras(k, v)
      }

      builder.build(activity.applicationContext)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun showConsentFlow(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    ConsentFlow()
      .withDismissListener { status ->
        emit("consentFlowDismissed", WritableNativeMap().apply { putInt("status", status) })
      }
      .withUIContext(activity)
      .showIfRequired()
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
    CAS.settings.fromReadableMap(settings)
    promise.resolve(null)
  }

  @ReactMethod
  fun getTargetingOptions(promise: Promise) {
    val to = CAS.getTargetingOptions()
    val out = WritableNativeMap().apply {
      putInt("age", to.age)
      putInt("gender", to.gender)
      to.contentUrl?.let { putString("contentUrl", it) }
      val arr = Arguments.createArray()
      (to.keywords ?: emptySet()).forEach { arr.pushString(it) }
      putArray("keywords", arr)
    }
    promise.resolve(out)
  }

  @ReactMethod
  fun setTargetingOptions(options: ReadableMap, promise: Promise) {
    val to = CAS.getTargetingOptions()
    if (options.hasKey("age") && !options.isNull("age")) to.age = options.getInt("age")
    if (options.hasKey("gender") && !options.isNull("gender")) to.gender = options.getInt("gender")
    if (options.hasKey("contentUrl") && !options.isNull("contentUrl")) to.contentUrl = options.getString("contentUrl")
    if (options.hasKey("keywords") && !options.isNull("keywords")) {
      val list = options.getArray("keywords")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
      to.keywords = list.toSet()
    }
    promise.resolve(null)
  }

  @ReactMethod
  fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitial?.isLoaded == true)
  }

  @ReactMethod
  fun loadInterstitialAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val interstitialAd = interstitial ?: CASInterstitial(appContext(), id).also { interstitial = it }
    interstitialAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(ad: AdContentInfo) {
        interstitialAd.contentCallback = null
        promise.resolve(null)
        emit("adLoaded", WritableNativeMap().apply { putString("type", "interstitial") })
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        interstitialAd.contentCallback = null
        promise.reject(Exception("Interstitial load failed: ${error.message}"))
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "interstitial")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
    }
    interstitialAd.load(appContext())
  }

  @ReactMethod
  fun showInterstitialAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val interstitialAd = interstitial ?: CASInterstitial(appContext(), id).also { interstitial = it }
    if (!interstitialAd.isLoaded) {
      promise.reject(IllegalStateException("Interstitial not loaded"))
      return
    }
    interstitialAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdShowed(ad: AdContentInfo) {
        emit("onShown", WritableNativeMap().apply { putString("type", "interstitial") })
      }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        promise.reject(Exception(error.message))
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "interstitial")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
      override fun onAdClicked(ad: AdContentInfo) {
        emit("onClicked", WritableNativeMap().apply { putString("type", "interstitial") })
      }
      override fun onAdDismissed(ad: AdContentInfo) {
        promise.resolve(null)
        emit("onClosed", WritableNativeMap().apply { putString("type", "interstitial") })
      }
    }
    interstitialAd.show(activity)
  }

  @ReactMethod
  fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewarded?.isLoaded == true)
  }

  @ReactMethod
  fun loadRewardedAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val rewardedAd = rewarded ?: CASRewarded(appContext(), id).also { rewarded = it }
    rewardedAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(ad: AdContentInfo) {
        rewardedAd.contentCallback = null
        promise.resolve(null)
        emit("adLoaded", WritableNativeMap().apply { putString("type", "rewarded") })
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        rewardedAd.contentCallback = null
        promise.reject(Exception("Rewarded load failed: ${error.message}"))
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "rewarded")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
    }
    rewardedAd.load(appContext())
  }

  @ReactMethod
  fun showRewardedAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val rewardedAd = rewarded ?: CASRewarded(appContext(), id).also { rewarded = it }

    if (!rewardedAd.isLoaded) {
      promise.reject(IllegalStateException("Rewarded not loaded"))
      return
    }

    rewardedAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdShowed(ad: AdContentInfo) {
        emit("onShown", WritableNativeMap().apply { putString("type", "rewarded") })
      }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        promise.reject(Exception(error.message))
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "rewarded")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
      override fun onAdClicked(ad: AdContentInfo) {
        emit("onClicked", WritableNativeMap().apply { putString("type", "rewarded") })
      }
      override fun onAdDismissed(ad: AdContentInfo) {
        promise.resolve(null)
        emit("onClosed", WritableNativeMap().apply { putString("type", "rewarded") })
      }
    }

    rewardedAd.show(
      activity,
      object : OnRewardEarnedListener {
        override fun onUserEarnedReward(ad: AdContentInfo) {
          emit("onRewarded", WritableNativeMap().apply { putString("type", "rewarded") })
        }
      }
    )
  }


  @ReactMethod
  fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpen?.isLoaded == true)
  }

  @ReactMethod
  fun loadAppOpenAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val appOpenAd = appOpen ?: CASAppOpen(appContext(), id).also { appOpen = it }
    appOpenAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(ad: AdContentInfo) {
        appOpenAd.contentCallback = null
        promise.resolve(null)
        emit("adLoaded", WritableNativeMap().apply { putString("type", "appopen") })
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        appOpenAd.contentCallback = null
        promise.reject(Exception("AppOpen load failed: ${error.message}"))
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "appopen")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
    }
    appOpenAd.load(appContext())
  }

  @ReactMethod
  fun showAppOpenAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val appOpenAd = appOpen ?: CASAppOpen(appContext(), id).also { appOpen = it }
    if (!appOpenAd.isLoaded) {
      promise.reject(IllegalStateException("AppOpen not loaded"))
      return
    }
    appOpenAd.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdShowed(ad: AdContentInfo) {
        emit("onShown", WritableNativeMap().apply { putString("type", "appopen") })
      }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        promise.reject(Exception(error.message))
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "appopen")
          putString("code", error.code.toString())
          putString("message", error.message)
        })
      }
      override fun onAdClicked(ad: AdContentInfo) {
        emit("onClicked", WritableNativeMap().apply { putString("type", "appopen") })
      }
      override fun onAdDismissed(ad: AdContentInfo) {
        promise.resolve(null)
        emit("onClosed", WritableNativeMap().apply { putString("type", "appopen") })
      }
    }
    appOpenAd.show(activity)
  }

  @ReactMethod fun addListener(eventName: String?) {}
  @ReactMethod fun removeListeners(count: Int?) {}
}
