package com.cleveradssolutions.plugin.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = CASMobileAdsModule.NAME)
class CASMobileAdsModule(reactContext: ReactApplicationContext)
  : NativeCASMobileAdsModuleSpec(reactContext) {

  companion object { const val NAME = "CASMobileAds" }
  override fun getName() = NAME

  private val impl = CASMobileAdsModuleImpl(reactContext)

  override fun initialize(casId: String, options: ReadableMap?, promise: Promise) =
    impl.initialize(casId, options, promise)

  override fun isInitialized(promise: Promise) =
    impl.isInitialized(promise)

  override fun showConsentFlow(promise: Promise) =
    impl.showConsentFlow(promise)

  override fun getSDKVersion(promise: Promise) =
    impl.getSDKVersion(promise)

  override fun setDebugLoggingEnabled(enabled: Boolean, promise: Promise) =
    impl.setDebugLoggingEnabled(enabled, promise)

  override fun setAdSoundsMuted(muted: Boolean, promise: Promise) =
    impl.setAdSoundsMuted(muted, promise)

  override fun setUserAge(age: Double, promise: Promise) =
    impl.setUserAge(age.toInt(), promise)

  override fun setUserGender(gender: Double, promise: Promise) =
    impl.setUserGender(gender.toInt(), promise)

  override fun setAppContentUrl(contentUrl: String?, promise: Promise) =
    impl.setAppContentUrl(contentUrl, promise)

  override fun setAppKeywords(keywords: ReadableArray, promise: Promise) =
    impl.setAppKeywords(keywords, promise)

  override fun setLocationCollectionEnabled(enabled: Boolean, promise: Promise) =
    impl.setLocationCollectionEnabled(enabled, promise)

  override fun setTrialAdFreeInterval(interval: Double, promise: Promise) =
    impl.setTrialAdFreeInterval(interval.toInt(), promise)

  override fun isInterstitialAdLoaded(promise: Promise) =
    impl.isInterstitialAdLoaded(promise)

  override fun loadInterstitialAd(promise: Promise) =
    impl.loadInterstitialAd(promise)

  override fun showInterstitialAd(promise: Promise) =
    impl.showInterstitialAd(promise)

  override fun setInterstitialAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setInterstitialAutoloadEnabled(enabled, promise)

  override fun setInterstitialAutoshowEnabled(enabled: Boolean, promise: Promise) =
    impl.setInterstitialAutoshowEnabled(enabled, promise)

  override fun setInterstitialMinInterval(seconds: Double, promise: Promise) =
    impl.setInterstitialMinInterval(seconds.toInt(), promise)

  override fun restartInterstitialInterval(promise: Promise) =
    impl.restartInterstitialInterval(promise)

  override fun destroyInterstitial(promise: Promise) =
    impl.destroyInterstitial(promise)

  override fun isRewardedAdLoaded(promise: Promise) =
    impl.isRewardedAdLoaded(promise)

  override fun loadRewardedAd(promise: Promise) =
    impl.loadRewardedAd(promise)

  override fun showRewardedAd(promise: Promise) =
    impl.showRewardedAd(promise)

  override fun setRewardedAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setRewardedAutoloadEnabled(enabled, promise)

  override fun destroyRewarded(promise: Promise) =
    impl.destroyRewarded(promise)

  override fun isAppOpenAdLoaded(promise: Promise) =
    impl.isAppOpenAdLoaded(promise)

  override fun loadAppOpenAd(promise: Promise) =
    impl.loadAppOpenAd(promise)

  override fun showAppOpenAd(promise: Promise) =
    impl.showAppOpenAd(promise)

  override fun setAppOpenAutoloadEnabled(enabled: Boolean, promise: Promise) =
    impl.setAppOpenAutoloadEnabled(enabled, promise)

  override fun setAppOpenAutoshowEnabled(enabled: Boolean, promise: Promise) =
    impl.setAppOpenAutoshowEnabled(enabled, promise)

  override fun destroyAppOpen(promise: Promise) =
    impl.destroyAppOpen(promise)

  override fun addListener(eventName: String?) {  }
  override fun removeListeners(count: Double) {  }
}
