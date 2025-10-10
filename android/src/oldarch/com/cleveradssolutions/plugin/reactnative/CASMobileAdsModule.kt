package com.cleveradssolutions.plugin.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = "CASMobileAds")
class CASMobileAdsModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  private val impl = CASMobileAdsModuleImpl(reactContext)

  override fun getName() = "CASMobileAds"

  @ReactMethod fun initialize(casId: String, options: ReadableMap?, promise: Promise) =
    impl.initialize(casId, options, promise)

  @ReactMethod fun isInitialized(promise: Promise) = impl.isInitialized(promise)
  @ReactMethod fun showConsentFlow(promise: Promise) = impl.showConsentFlow(promise)
  @ReactMethod fun getSDKVersion(promise: Promise) = impl.getSDKVersion(promise)
  @ReactMethod fun setDebugLoggingEnabled(enabled: Boolean, promise: Promise) =
    impl.setDebugLoggingEnabled(enabled, promise)
  @ReactMethod fun setAdSoundsMuted(muted: Boolean, promise: Promise) =
    impl.setAdSoundsMuted(muted, promise)
  @ReactMethod fun setUserAge(age: Int, promise: Promise) = impl.setUserAge(age, promise)
  @ReactMethod fun setUserGender(gender: Int, promise: Promise) = impl.setUserGender(gender, promise)
  @ReactMethod fun setAppContentUrl(contentUrl: String?, promise: Promise) =
    impl.setAppContentUrl(contentUrl, promise)
  @ReactMethod fun setAppKeywords(keywords: ReadableArray, promise: Promise) =
    impl.setAppKeywords(keywords, promise)
  @ReactMethod fun setLocationCollectionEnabled(enabled: Boolean, promise: Promise) =
    impl.setLocationCollectionEnabled(enabled, promise)
  @ReactMethod fun setTrialAdFreeInterval(interval: Int, promise: Promise) =
    impl.setTrialAdFreeInterval(interval, promise)

  // interstitial / rewarded / appopen — так само просто делегуємо в impl:
  @ReactMethod fun isInterstitialAdLoaded(promise: Promise) = impl.isInterstitialAdLoaded(promise)
  @ReactMethod fun loadInterstitialAd(promise: Promise) = impl.loadInterstitialAd(promise)
  @ReactMethod fun showInterstitialAd(promise: Promise) = impl.showInterstitialAd(promise)
  @ReactMethod fun setInterstitialAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setInterstitialAutoloadEnabled(enabled, promise)
  @ReactMethod fun setInterstitialAutoshowEnabled(enabled: Boolean, promise: Promise) =
    impl.setInterstitialAutoshowEnabled(enabled, promise)
  @ReactMethod fun setInterstitialMinInterval(seconds: Int, promise: Promise) =
    impl.setInterstitialMinInterval(seconds, promise)
  @ReactMethod fun restartInterstitialInterval(promise: Promise) = impl.restartInterstitialInterval(promise)
  @ReactMethod fun destroyInterstitial(promise: Promise) = impl.destroyInterstitial(promise)

  @ReactMethod fun isRewardedAdLoaded(promise: Promise) = impl.isRewardedAdLoaded(promise)
  @ReactMethod fun loadRewardedAd(promise: Promise) = impl.loadRewardedAd(promise)
  @ReactMethod fun showRewardedAd(promise: Promise) = impl.showRewardedAd(promise)
  @ReactMethod fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setRewardedAutoloadEnabled(enabled, promise)
  @ReactMethod fun destroyRewarded(promise: Promise) = impl.destroyRewarded(promise)

  @ReactMethod fun isAppOpenAdLoaded(promise: Promise) = impl.isAppOpenAdLoaded(promise)
  @ReactMethod fun loadAppOpenAd(promise: Promise) = impl.loadAppOpenAd(promise)
  @ReactMethod fun showAppOpenAd(promise: Promise) = impl.showAppOpenAd(promise)
  @ReactMethod fun setAppOpenAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setAppOpenAutoloadEnabled(enabled, promise)
  @ReactMethod fun setAppOpenAutoshowEnabled(enabled: Boolean, promise: Promise) =
    impl.setAppOpenAutoshowEnabled(enabled, promise)
  @ReactMethod fun destroyAppOpen(promise: Promise) = impl.destroyAppOpen(promise)

  // events-стабби
  @ReactMethod fun addListener(eventName: String?) { }
  @ReactMethod fun removeListeners(count: Int) { }
}
