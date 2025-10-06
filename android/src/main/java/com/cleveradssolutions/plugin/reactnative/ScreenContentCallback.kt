package com.cleveradssolutions.plugin.reactnative

import com.cleveradssolutions.plugin.reactnative.extensions.toReadableMap
import com.cleveradssolutions.sdk.AdContentInfo
import com.cleveradssolutions.sdk.AdFormat
import com.cleveradssolutions.sdk.OnAdImpressionListener
import com.cleveradssolutions.sdk.screen.OnRewardEarnedListener
import com.cleveradssolutions.sdk.screen.ScreenAdContentCallback
import com.cleversolutions.ads.AdError
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class ScreenContentCallback(
  private val reactContext: ReactApplicationContext,
  private val adType: String
) : ScreenAdContentCallback(), OnAdImpressionListener, OnRewardEarnedListener {

  private fun title(): String = when (adType) {
    "interstitial" -> "Interstitial"
    "rewarded" -> "Rewarded"
    "appopen" -> "AppOpen"
    else -> "Ad"
  }

  private fun emit(event: String, map: WritableNativeMap = WritableNativeMap()) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(event, map)
  }

  override fun onAdImpression(ad: AdContentInfo) {
    val map = WritableNativeMap().apply {
      putMap("impression", ad.toReadableMap())
    }
    emit("on${title()}Impression", map)
  }


  override fun onUserEarnedReward(ad: AdContentInfo) {
    emit("onRewardedCompleted", WritableNativeMap())
  }

  override fun onAdLoaded(ad: AdContentInfo) {
    emit("on${title()}Loaded", WritableNativeMap())
  }

  override fun onAdFailedToLoad(format: AdFormat, error: AdError) {
    val map = WritableNativeMap().apply {
      putInt("errorCode", error.code)
      putString("errorMessage", error.message)
    }
    emit("on${title()}LoadFailed", map)
  }

  override fun onAdShowed(ad: AdContentInfo) {
    emit("on${title()}Displayed", WritableNativeMap())
  }

  override fun onAdFailedToShow(format: AdFormat, error: AdError) {
    val map = WritableNativeMap().apply {
      putInt("errorCode", error.code)
      putString("errorMessage", error.message)
    }
    emit("on${title()}FailedToShow", map)
  }

  override fun onAdClicked(ad: AdContentInfo) {
    emit("on${title()}Clicked", WritableNativeMap())
  }

  override fun onAdDismissed(ad: AdContentInfo) {
    emit("on${title()}Hidden", WritableNativeMap())
  }
}
