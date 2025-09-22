package com.cleveradssolutions.plugin.reactnative

import android.app.Activity
import android.content.Context
import com.cleveradssolutions.plugin.reactnative.extensions.fromReadableMap
import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleversolutions.ads.AdError
import com.cleversolutions.ads.ConsentFlow
import com.cleversolutions.ads.android.CAS
import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.AdFormat
import com.cleveradssolutions.sdk.screen.CASAppOpen
import com.cleveradssolutions.sdk.screen.CASInterstitial
import com.cleveradssolutions.sdk.screen.CASRewarded
import com.cleveradssolutions.sdk.screen.OnRewardEarnedListener
import com.cleveradssolutions.sdk.screen.ScreenAdContentCallback
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class CASMobileAds(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {

  override fun getName() = "CASMobileAds"

  private var casId: String? = null
  private var interstitial: CASInterstitial? = null
  private var rewarded: CASRewarded? = null
  private var appOpen: CASAppOpen? = null

private var mediationExtras = HashMap<String, String>()
  private var consentFlowEnabled = true

  private fun appContext(): Context = ctx.applicationContext

  private fun currentActivityOrReject(p: Promise): Activity? {
    val a = ctx.currentActivity
    TODO("Прибрати reject")
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
  fun initialize(casId:String, testMode:Boolean, promise: Promise) {
    try {
      val activity = currentActivityOrReject(promise) ?: return
      
      val id = params.getString("casId")!!
      casId = id

      val builder = CAS.buildManager()
        .withCasId(id)
        .withConsentFlow(ConsentFlow(consentFlowEnabled))
        .withCompletionListener {
          val resp = WritableNativeMap()
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

      mediationExtras.forEach {
        val k = it.key
        val v = it.value
        if (!k.isNullOrEmpty() && !v.isNullOrEmpty()) builder.withMediationExtras(k, v)
      }

      builder.build(activity)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

   @ReactMethod
  fun setMediationExtras(key:String, value:String, promise: Promise) {
    mediationExtras[key] = value
  }

  @ReactMethod
  fun showConsentFlow(promise: Promise) {
    CASHandler.main{
      ConsentFlow()
        .withDismissListener { status ->
          emit("consentFlowDismissed", WritableNativeMap().apply { putInt("status", status) })
        }
        .showIfRequired()
    }
    promise.resolve(null)
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
      TODO()
      val s = CAS.settings
      val t = CAS.getTargetingOptions()

      val out = WritableNativeMap().apply {
        putInt("taggedAudience", s.taggedAudience)
        putBoolean("debugMode", s.debugMode)
        putBoolean("mutedAdSounds", s.mutedAdSounds)

        val testIds = Arguments.createArray()
        (s.testDeviceIDs ?: emptySet()).forEach { testIds.pushString(it) }
        putArray("testDeviceIDs", testIds)

        putInt("trialAdFreeInterval", s.trialAdFreeInterval)

        putInt("age", t.age)
        putInt("gender", t.gender)
        t.contentUrl?.let { putString("contentUrl", it) }

        val kw = Arguments.createArray()
        (t.keywords ?: emptySet()).forEach { kw.pushString(it) }
        putArray("keywords", kw)
      }

      promise.resolve(out)
    } catch (e: Exception) {
      promise.reject(e)
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
          val arr = map.getArray("testDeviceIDs")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
          testDeviceIDs = arr.toSet()
        }

        if (map.hasKey("trialAdFreeInterval") && !map.isNull("trialAdFreeInterval"))
          trialAdFreeInterval = map.getInt("trialAdFreeInterval")
      }

      CAS.getTargetingOptions().apply {
        if (map.hasKey("age") && !map.isNull("age"))
          age = map.getInt("age")

        if (map.hasKey("gender") && !map.isNull("gender"))
          gender = map.getInt("gender")

        if (map.hasKey("contentUrl") && !map.isNull("contentUrl"))
          contentUrl = map.getString("contentUrl")

        if (map.hasKey("keywords") && !map.isNull("keywords")) {
          val list = map.getArray("keywords")?.toArrayList()?.filterIsInstance<String>() ?: emptyList()
          keywords = list.toSet()
        }
      }

      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }



  @ReactMethod
  fun isInterstitialAdLoaded(promise: Promise) {
    promise.resolve(interstitial?.isLoaded == true)
  }

  @ReactMethod
  fun loadInterstitialAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val ad = interstitial ?: CASInterstitial(appContext(), id).also { interstitial = it }
   TODO()
   ad.iaAutoloadEnabled 


    ad.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(adInfo: AdContentInfo) {
        ad.contentCallback = null
        emit("adLoaded", WritableNativeMap().apply { putString("type", "interstitial") })
        promise.resolve(null)
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        ad.contentCallback = null
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "interstitial")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception("Interstitial load failed: ${error.message}"))
      }
    }
    ad.load(appContext())
  }

  @ReactMethod
  fun showInterstitialAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val ad = interstitial ?: CASInterstitial(appContext(), id).also { interstitial = it }
    if (!ad.isLoaded) {
      promise.reject(IllegalStateException("Interstitial not loaded"))
      return
    }
    val contentCallback = TODO()
    
    
    object : ScreenAdContentCallback() {
      override fun onAdShowed(adInfo: AdContentInfo) { emit("onShown", WritableNativeMap().apply { putString("type", "interstitial") }) }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "interstitial")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception(error.message))
      }
      override fun onAdClicked(adInfo: AdContentInfo) { emit("onClicked", WritableNativeMap().apply { putString("type", "interstitial") }) }
      override fun onAdDismissed(adInfo: AdContentInfo) {
        emit("onClosed", WritableNativeMap().apply { putString("type", "interstitial") })
        promise.resolve(null)
      }
    }
    ad.contentCallback = contentCallback
    ad.onImpressionListener = contentCallback
    ad.show(ctx.currentActivity)
  }


  @ReactMethod
  fun isRewardedAdLoaded(promise: Promise) {
    promise.resolve(rewarded?.isLoaded == true)
  }

  @ReactMethod
  fun loadRewardedAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val ad = rewarded ?: CASRewarded(appContext(), id).also { rewarded = it }
    ad.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(adInfo: AdContentInfo) {
        ad.contentCallback = null
        emit("adLoaded", WritableNativeMap().apply { putString("type", "rewarded") })
        promise.resolve(null)
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        ad.contentCallback = null
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "rewarded")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception("Rewarded load failed: ${error.message}"))
      }
    }
    ad.load(appContext())
  }

  @ReactMethod
  fun showRewardedAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val ad = rewarded ?: CASRewarded(appContext(), id).also { rewarded = it }
    if (!ad.isLoaded) {
      promise.reject(IllegalStateException("Rewarded not loaded"))
      return
    }
    ad.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdShowed(adInfo: AdContentInfo) { emit("onShown", WritableNativeMap().apply { putString("type", "rewarded") }) }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "rewarded")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception(error.message))
      }
      override fun onAdClicked(adInfo: AdContentInfo) { emit("onClicked", WritableNativeMap().apply { putString("type", "rewarded") }) }
      override fun onAdDismissed(adInfo: AdContentInfo) {
        emit("onClosed", WritableNativeMap().apply { putString("type", "rewarded") })
        promise.resolve(null)
      }
    }
    ad.show(activity, OnRewardEarnedListener { emit("onRewarded", WritableNativeMap().apply { putString("type", "rewarded") }) })
  }


  @ReactMethod
  fun isAppOpenAdLoaded(promise: Promise) {
    promise.resolve(appOpen?.isLoaded == true)
  }

  @ReactMethod
  fun loadAppOpenAd(promise: Promise) {
    val id = requireCasId(promise) ?: return
    val ad = appOpen ?: CASAppOpen(appContext(), id).also { appOpen = it }
    ad.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdLoaded(adInfo: AdContentInfo) {
        ad.contentCallback = null
        emit("adLoaded", WritableNativeMap().apply { putString("type", "appopen") })
        promise.resolve(null)
      }
      override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
        ad.contentCallback = null
        emit("adFailedToLoad", WritableNativeMap().apply {
          putString("type", "appopen")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception("AppOpen load failed: ${error.message}"))
      }
    }
    ad.load(appContext())
  }

  @ReactMethod
  fun showAppOpenAd(promise: Promise) {
    val activity = currentActivityOrReject(promise) ?: return
    val id = requireCasId(promise) ?: return
    val ad = appOpen ?: CASAppOpen(appContext(), id).also { appOpen = it }
    if (!ad.isLoaded) {
      promise.reject(IllegalStateException("AppOpen not loaded"))
      return
    }
    ad.contentCallback = object : ScreenAdContentCallback() {
      override fun onAdShowed(adInfo: AdContentInfo) { emit("onShown", WritableNativeMap().apply { putString("type", "appopen") }) }
      override fun onAdFailedToShow(format: AdFormat, error: AdError) {
        emit("onShowFailed", WritableNativeMap().apply {
          putString("type", "appopen")
          putInt("code", error.code)
          putString("message", error.message)
        })
        promise.reject(Exception(error.message))
      }
      override fun onAdClicked(adInfo: AdContentInfo) { emit("onClicked", WritableNativeMap().apply { putString("type", "appopen") }) }
      override fun onAdDismissed(adInfo: AdContentInfo) {
        emit("onClosed", WritableNativeMap().apply { putString("type", "appopen") })
        promise.resolve(null)
      }
    }
    ad.show(activity)
  }

  @ReactMethod fun addListener(eventName: String?) {}
  @ReactMethod fun removeListeners(count: Int?) {}
}
